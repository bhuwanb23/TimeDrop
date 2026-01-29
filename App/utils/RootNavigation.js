import React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  console.log('Global navigate called:', name, params);
  console.log('Navigation ref current:', navigationRef.current);
  if (navigationRef.current) {
    navigationRef.current?.navigate(name, params);
    console.log('Navigation successful');
  } else {
    console.log('Navigation ref is null - navigation failed');
  }
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function reset(state) {
  navigationRef.current?.reset(state);
}