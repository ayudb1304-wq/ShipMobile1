const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Find the project root (monorepo root)
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// Let Metro know where to resolve packages from (monorepo root)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Disable hierarchical lookup (use explicit paths above instead)
config.resolver.disableHierarchicalLookup = true;

// Apply NativeWind configuration
module.exports = withNativeWind(config, {
  input: '../../packages/ui/global.css',
  projectRoot,
  inlineRem: false,
});
