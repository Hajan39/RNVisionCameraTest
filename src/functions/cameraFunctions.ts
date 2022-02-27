import {ImageCropData} from 'react-native';
export const gcd = (a: number, b: number): number => {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
};

export const getRatio = (a: number, b: number): number[] => {
  const gc = gcd(a, b);
  return [a / gc, b / gc];
};

export const calcImgSizes = (
  originWidth: number,
  originHeight: number,
  ratio: number,
): ImageCropData => {
  const imgparsed = originHeight / originWidth;
  if (!((ratio > 1 && imgparsed > 1) || (ratio < 1 && imgparsed < 1))) {
    ratio = 1 / ratio;
  }
  let opts: ImageCropData;

  if (ratio < originHeight / originWidth) {
    const h = originWidth * ratio;
    opts = {
      offset: {
        x: 0,
        y: (originHeight - h) / 2,
      },
      size: {
        width: originWidth,
        height: h,
      },
    };
  } else {
    const w = originHeight / ratio;
    opts = {
      offset: {
        x: (originWidth - w) / 2,
        y: 0,
      },
      size: {
        width: w,
        height: originHeight,
      },
    };
  }
  return opts;
};

export const normalizeImagePath = (uri: string, withFile = true, dateSuffix?: string | number) => {
  let res = uri.replace(/file:\/\//g, '').split('?')[0];
  if (withFile) {
    res = 'file://' + res;
  }
  if (dateSuffix) {
    res = res + `?v=${dateSuffix}`;
  }
  return res;
};

/**
 * There is an issue in Android native camera coordinates system, so focus position needs to be rotated.
 */
export function transformFocusCoordinates(
  touchX: number,
  touchY: number,
  width: number,
  height: number,
): [number, number] {
  const transformedX = (touchY / height) * width;
  const transformedY = height - (touchX / width) * height;
  return [transformedX, transformedY];
}
