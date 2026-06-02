import * as tf from "@tensorflow/tfjs";
import { FEATURE_GRID_SIZE } from "./constants";

export function extractFeaturesFromVideo(video: HTMLVideoElement): number[] {
  return tf.tidy(() => {
    const tensor = tf.browser.fromPixels(video);
    const resized = tf.image.resizeBilinear(tensor, [
      FEATURE_GRID_SIZE,
      FEATURE_GRID_SIZE,
    ]);
    const normalized = resized.toFloat().div(255);
    return Array.from(normalized.dataSync());
  });
}
