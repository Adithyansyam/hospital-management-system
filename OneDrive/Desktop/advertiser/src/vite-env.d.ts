/// <reference types="vite/client" />

// Framer Motion module declaration
declare module 'framer-motion' {
  export * from 'framer-motion/dist/framer-motion';
}

// React Icons module declaration
declare module 'react-icons/fa' {
  import { IconType } from 'react-icons';
  
  export const FaBullseye: IconType;
  export const FaLightbulb: IconType;
  export const FaHandshake: IconType;
  export const FaMapMarkerAlt: IconType;
  export const FaPhoneAlt: IconType;
  export const FaEnvelope: IconType;
  export const FaPaperPlane: IconType;
  // Add other icons as needed
}

// CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Image files
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.svg';
declare module '*.gif';

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly VITE_API_URL?: string;
  }
}

// For CSS modules with TypeScript
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
