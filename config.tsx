// rspack.config.prod.ts
import { composePlugins, withNx, withReact, type RspackOptions } from '@nx/rspack';
import { type HtmlRspackPlugin } from '@rspack/core';

// Type definitions for better maintainability
type CacheGroupConfig = {
  name: string;
  chunks: 'all' | 'async' | 'initial';
  test?: RegExp | ((module: any) => boolean);
  priority: number;
  enforce?: boolean;
  minChunks?: number;
  maxAsyncRequests?: number;
  maxInitialRequests?: number;
};

type OptimizationConfig = {
  splitChunks: {
    chunks: 'all' | 'async' | 'initial';
    minSize: number;
    maxSize: number;
    minChunks: number;
    maxAsyncRequests: number;
    maxInitialRequests: number;
    cacheGroups: Record<string, CacheGroupConfig>;
  };
  sideEffects: boolean;
  usedExports: boolean;
  providedExports: boolean;
};

// Performance-optimized configuration
export default composePlugins(
  withNx({
    baseHref: '/',
    // Enhanced memory management for large projects
    memoryLimit: 12288, // Increased from 8192
    skipTypeChecking: true, // Enable once TS issues are resolved
    vendorChunk: true,
    outputHashing: 'all',
    optimization: true,
    // Enable source maps for debugging but optimize for size
    sourceMap: 'hidden-source-map',
  }),
  withReact({
    svgr: true,
  }),
  (config: RspackOptions) => {
    // Advanced optimization configuration
    const optimizationConfig: OptimizationConfig = {
      splitChunks: {
        chunks: 'all',
        minSize: 20000, // Minimum chunk size
        maxSize: 244000, // Maximum chunk size for better caching
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          // React and core dependencies
          react: {
            name: 'react',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Vendor libraries (high priority)
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            enforce: true,
            maxAsyncRequests: 1,
          },
          // Common chunks (your internal libraries)
          common: {
            name: 'common',
            chunks: 'all',
            test: /[\\/](libs|src)[\\/]/,
            priority: 10,
            minChunks: 2,
            maxAsyncRequests: 5,
          },
          // Default async chunks
          default: {
            name: 'default',
            chunks: 'async',
            priority: 1,
            minChunks: 2,
          },
        },
      },
      // Enable advanced tree shaking
      sideEffects: false,
      usedExports: true,
      providedExports: true,
    };

    // Enhanced configuration object
    const enhancedConfig: RspackOptions = {
      ...config,

      // Performance optimizations
      optimization: {
        ...config.optimization,
        ...optimizationConfig,
        // Enable module concatenation for better performance
        concatenateModules: true,
        // Optimize module ids for better caching
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
      },

      // Advanced caching strategy
      cache: {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        // Cache in node_modules for faster CI builds
        cacheDirectory: 'node_modules/.cache/rspack',
      },

      // Resolver optimizations
      resolve: {
        ...config.resolve,
        // Reduce resolution time
        modules: ['node_modules'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        // Enable symlinks resolution for nx libraries
        symlinks: true,
        // Cache module resolution
        cache: true,
      },

      // Enhanced plugins configuration
      plugins: [
        ...(config.plugins || []),

        // Filter out problematic plugins and add optimized ones
        ...(config.plugins || []).filter((plugin: any) => {
          // Remove conflicting plugins if any
          return !['HtmlRspackPlugin', 'TsCheckerRspackPlugin'].includes(plugin?.constructor?.name);
        }),

        // Optimized HTML plugin
        new (require('@rspack/core').HtmlRspackPlugin)({
          template: './public/index.html',
          filename: 'index.html',
          chunks: ['main'],
          inject: true,
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        }) as any,
      ],

      // Module rules optimization
      module: {
        ...config.module,
        rules: [
          ...(config.module?.rules || []),
          // Add rules for better asset handling
          {
            test: /\.(png|jpe?g|gif|svg|webp)$/i,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 8 * 1024, // 8kb
              },
            },
            generator: {
              filename: 'assets/images/[name].[contenthash:8][ext]',
            },
          },
        ],
      },

      // Performance hints
      performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      },
    };

    return enhancedConfig;
  }
);
