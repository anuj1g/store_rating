import { useState, useEffect, ReactNode } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  useMediaQuery, 
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  RateReview as ReviewIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Home as HomeIcon,
  AdminPanelSettings as AdminIcon,
  Storefront as StorefrontIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { ROUTES, THEME_CONFIG } from '../config/app';
import { useAuth } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeContext';

const drawerWidth = 240;

type NavItem = {
  text: string;
  icon: ReactNode;
  path: string;
  roles?: string[];
  divider?: boolean;
};

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { themeMode, toggleTheme, isDarkMode } = useThemeMode();
  const navigate = useNavigate();

  // Navigation items for regular users
  const userNavItems: NavItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
    { text: 'Stores', icon: <StoreIcon />, path: ROUTES.STORES.LIST },
    { text: 'My Reviews', icon: <ReviewIcon />, path: '/my-reviews' },
  ];

  // Navigation items for store owners
  const ownerNavItems: NavItem[] = [
    { text: 'Owner Dashboard', icon: <DashboardIcon />, path: ROUTES.OWNER.DASHBOARD },
    { text: 'My Stores', icon: <StorefrontIcon />, path: ROUTES.OWNER.STORES },
    { text: 'Store Reviews', icon: <ReviewIcon />, path: ROUTES.OWNER.REVIEWS },
    { text: 'Analytics', icon: <BarChartIcon />, path: ROUTES.OWNER.ANALYTICS },
  ];

  // Navigation items for admins
  const adminNavItems: NavItem[] = [
    { text: 'Admin Dashboard', icon: <DashboardIcon />, path: ROUTES.ADMIN.DASHBOARD },
    { text: 'Users', icon: <PeopleIcon />, path: ROUTES.ADMIN.USERS },
    { text: 'Stores', icon: <StoreIcon />, path: ROUTES.ADMIN.STORES },
  ];

  // Get navigation items based on user role
  const getNavItems = (): NavItem[] => {
    if (!user) return [];
    
    const commonItems = [
      { text: 'Home', icon: <HomeIcon />, path: ROUTES.HOME },
    ];
    
    if (user.role === 'admin') {
      return [...commonItems, ...adminNavItems];
    } else if (user.role === 'owner') {
      return [...commonItems, ...ownerNavItems];
    } else {
      return [...commonItems, ...userNavItems];
    }
  };

  const navItems = getNavItems();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Close mobile drawer when route changes
  useEffect(() => {
    if (mobileOpen && isMobile) {
      setMobileOpen(false);
    }
  }, [pathname, isMobile]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate(ROUTES.LOGIN, { replace: true });
    return null;
  }

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          Store Rating
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {navItems.find((item) => item.path === pathname)?.text || 'Welcome'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                  startIcon={
                    <Avatar
                      alt={user.name}
                      src={user.avatarUrl || undefined}
                      sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  sx={{ textTransform: 'none' }}
                >
                  {user.name}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => { handleNavigate(ROUTES.PROFILE); handleMenuClose(); }}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => { handleNavigate('/settings'); handleMenuClose(); }}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar /> {/* This is needed to push content below the app bar */}
        <Box sx={{ mt: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
