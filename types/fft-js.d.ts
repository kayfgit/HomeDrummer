declare module "fft-js" {
    export interface FFTResult {
        re: number[];
        im: number[];
    }

    export function fft(signal: number[]): [number[], number[]];
    export function ifft(phasors: [number[], number[]]): number[];

    export namespace util {
        export function fftFreq(phasors: [number[], number[]], sampleRate: number): number[];
        export function fftMag(phasors: [number[], number[]]): number[];
    }
}
