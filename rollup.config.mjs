import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import html from 'rollup-plugin-html-bundle'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import kontra from 'rollup-plugin-kontra'
import { terser } from 'rollup-plugin-terser'
import cleanup from "rollup-plugin-cleanup";

const prod = process.env.NODE_ENV === 'production'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
  },
  plugins: [
    kontra({
      gameObject: { group: false, acceleration: true, rotation: false, velocity: true, scale: false, anchor: true, ttl: true },
      sprite: { animation: false, image: false },
      tileEngine: false,
      text: { textAlign: true, newline: false, autoNewline: false, rtl: false, stroke: false },
      vector: false,
    }),
    // cleanup({ comments: "some", }),
    commonjs(),
    resolve(),
    esbuild({
      include: /\.[jt]s$/,
      tsconfig: 'tsconfig.json',
    }),
    prod && terser(),
    html({
      template: 'src/index.html',
      target: 'dist/index.html',
      inline: true,
    }),
    !prod && serve('dist'),
    !prod && livereload('dist'),
  ],
}
