module.exports = {
  // Use single quotes for strings
  singleQuote: true,
  
  // Use double quotes for JSX
  jsxSingleQuote: false,
  
  // Add a trailing comma wherever possible
  trailingComma: 'es5',
  
  // Use 2 spaces for indentation
  tabWidth: 2,
  
  // Use spaces instead of tabs
  useTabs: false,
  
  // Add semicolons at the end of statements
  semi: true,
  
  // Print spaces between brackets in object literals
  bracketSpacing: true,
  
  // Put the `>` of a multi-line JSX element at the end of the last line
  jsxBracketSameLine: false,
  
  // Include parentheses around a sole arrow function parameter
  arrowParens: 'always',
  
  // Line length before wrapping
  printWidth: 100,
  
  // Format only the content between the special @prettier and @format comments
  requirePragma: false,
  
  // Auto-insert @format pragma when file is formatted
  insertPragma: false,
  
  // Respect default end of line character
  endOfLine: 'lf',
  
  // Format embedded code if Prettier can identify it
  embeddedLanguageFormatting: 'auto',
  
  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',
  
  // Whether to wrap prose when it exceeds the print width
  proseWrap: 'preserve',
  
  // Controls the behavior of quotes in JSX
  quoteProps: 'as-needed',
  
  // Controls the printing of spaces inside array brackets
  bracketSameLine: false,
  
  // Controls the printing of commas wherever possible
  singleAttributePerLine: false,
};

// This configuration ensures consistent code formatting across the project
// It works well with TypeScript, React, and modern JavaScript features
// The settings are optimized for readability and maintainability
