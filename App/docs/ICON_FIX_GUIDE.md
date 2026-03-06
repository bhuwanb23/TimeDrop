# Icon Loading Fix Guide

## Problem
MaterialIcons (and other @expo/vector-icons) are failing to load, causing:
- `NetworkError: A network error occurred`
- Icons not displaying on some screens
- ERR_ABORTED 500 errors

## Root Cause
This happens because:
1. Expo Go tries to load font files from the dev server
2. Web browsers block local font file access
3. The font assets aren't properly linked in web builds

## Solutions

### Solution 1: Use Platform-Specific Icons (RECOMMENDED)

For **web compatibility**, replace MaterialIcons with cross-platform alternatives:

```javascript
// Instead of:
import { MaterialIcons } from '@expo/vector-icons';

// Use for maximum compatibility:
import { Ionicons } from '@expo/vector-icons';
// or
import { FontAwesome } from '@expo/vector-icons';
```

**Ionicons** are pre-loaded in Expo and work everywhere without issues.

### Solution 2: Clear Cache and Rebuild

Run these commands in order:

```bash
cd c:\Users\bhuwan.bhawarlal\Desktop\projects\TimeDrop\App

# Stop Expo if running
# Press Ctrl+C in terminal

# Clear all caches
npm start --clear --reset-cache

# Or manually delete cache folders
rm -rf .expo
rm -rf node_modules/.cache

# Restart
npm start
```

### Solution 3: Use Emoji/Simple Components (Quick Fix)

For critical UI elements, temporarily use emoji or simple components:

```javascript
// Instead of icon:
<MaterialIcons name="shopping-cart" size={24} color="#fff" />

// Use emoji (temporary):
<Text style={{ fontSize: 24 }}>🛒</Text>

// Or simple View with styling:
<View style={styles.circleIcon}>
  <Text style={{ color: '#fff', fontSize: 16 }}>📦</Text>
</View>
```

### Solution 4: Preload Fonts (For Production)

Add to your main App.js:

```javascript
import * as Font from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';

const [fontsLoaded] = Font.useFonts({
  'MaterialIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
});

if (!fontsLoaded) {
  return <ActivityIndicator />;
}
```

## Quick Fixes Applied

I've updated the app to use **Ionicons** where possible, which are more reliable across platforms.

## Test After Fix

1. Run: `npm start --clear`
2. Test on web: press `w`
3. Test on iOS: press `i`
4. Test on Android: press `a`

Icons should now load without errors!

## Alternative: If Icons Still Don't Load

If you still see icon errors, the app will gracefully degrade:
- Icons may show as empty boxes
- Text labels will still be visible
- All functionality works normally
- No crashes or broken features

The icon errors are cosmetic and don't affect app functionality.
