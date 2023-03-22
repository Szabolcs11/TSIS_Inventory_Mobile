import {View, Text} from 'react-native';
import React from 'react';
import {Svg, G, Path, Defs, Rect, ClipPath} from 'react-native-svg';

export default function QrCodeLogo() {
  return (
    <Svg width="130" height="130" viewBox="0 0 130 130" fill="none">
      <G>
        <Path
          d="M21.6667 37.9166V32.5C21.6667 29.6268 22.808 26.8713 24.8397 24.8396C26.8713 22.808 29.6268 21.6666 32.5 21.6666H43.3333"
          stroke="white"
          strokeWidth="6.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M21.6667 92.0834V97.5C21.6667 100.373 22.808 103.129 24.8397 105.16C26.8713 107.192 29.6268 108.333 32.5 108.333H43.3333"
          stroke="white"
          strokeWidth="6.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M86.6667 21.6666H97.5C100.373 21.6666 103.129 22.808 105.16 24.8396C107.192 26.8713 108.333 29.6268 108.333 32.5V37.9166"
          stroke="white"
          strokeWidth="6.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M86.6667 108.333H97.5C100.373 108.333 103.129 107.192 105.16 105.16C107.192 103.129 108.333 100.373 108.333 97.5V92.0834"
          stroke="white"
          strokeWidth="6.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M27.0833 65H102.917"
          stroke="white"
          strokeWidth="6.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_45_251">
          <Rect width="130" height="130" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
