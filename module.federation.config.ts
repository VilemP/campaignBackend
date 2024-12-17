// module-federation.config.ts

interface SharedConfig {
    singleton: boolean;
    strictVersion: boolean;
    requiredVersion: string;
  }
  
  interface PackageJson {
    dependencies: {
      [key: string]: string;
    };
  }
  
  interface RemoteConfig {
    name: string;
    exposes: {
      [key: string]: string;
    };
    remoteEntry?: string; // Optional: can be set in vite.config.ts
  }
  
  interface HostConfig {
    name: string;
    remotes: {
      [key: string]: string;
    };
  }
  
  // Dependencies that will be shared between host and remotes
  const sharedDependencies = new Set([
    '@angular/core',
    '@angular/common',
    '@angular/router',
    '@angular/forms',
    'rxjs'
  ]);
  
  // Generates the shared dependencies configuration
  export const getSharedConfig = (packageJson: PackageJson): Record<string, SharedConfig> => {
    const shared: Record<string, SharedConfig> = {};
    
    sharedDependencies.forEach(dep => {
      if (packageJson.dependencies[dep]) {
        shared[dep] = {
          singleton: true,        // Only one version of the dependency will be loaded
          strictVersion: true,    // Ensures version matching between host and remotes
          requiredVersion: packageJson.dependencies[dep]
        };
      }
    });
    
    return shared;
  };
  
  // Host (campaign-platform) configuration
  export const hostConfig: HostConfig = {
    name: 'campaign-platform',
    // Remotes configuration defines where to find each remote application
    // The port numbers (4201, 4202, 4203) are defined in each remote's vite.config.ts
    remotes: {
      'ad-distribution': 'http://localhost:4201/remoteEntry.js',
      'supply-shaping': 'http://localhost:4202/remoteEntry.js',
      'forecasting': 'http://localhost:4203/remoteEntry.js'
    }
  };
  
  // Remote applications configuration
  export const remoteConfigs: Record<string, RemoteConfig> = {
    'ad-distribution': {
      name: 'ad-distribution',
      // 'exposes' defines which modules this remote makes available to the host
      // The key ('./Module') is what the host will use to import the module
      // The value is the path to the actual module in the remote's codebase
      exposes: {
        './Module': './domains/ad-distribution/src/app/remote-entry/entry.module.ts'
      }
    },
    'supply-shaping': {
      name: 'supply-shaping',
      exposes: {
        './Module': './domains/supply-shaping/src/app/remote-entry/entry.module.ts'
      }
    },
    'forecasting': {
      name: 'forecasting',
      exposes: {
        './Module': './domains/forecasting/src/app/remote-entry/entry.module.ts'
      }
    }
  };
  
  // The port numbers for remote applications will be configured in each remote's vite.config.ts:
  /*
  // Example for ad-distribution's vite.config.ts
  export default defineConfig({
    server: {
      port: 4201,  // Forces this remote to always use port 4201
      strictPort: true  // Fails if port 4201 is not available
    },
    // ... other configuration
  });
  */