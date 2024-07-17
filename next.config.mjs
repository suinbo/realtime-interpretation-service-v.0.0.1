/** @type {import('next').NextConfig} */

import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const nextConfig = {
    output: "export",
    images: {
        unoptimized: true,
    },
    webpack: config => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@app": path.resolve(__dirname, "src/app"),
            "@atoms": path.resolve(__dirname, "src/atoms"),
            // "@images": path.resolve(__dirname, "src/assets/images"),
            "@components": path.resolve(__dirname, "src/components"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@resources": path.resolve(__dirname, "src/resources"),
            "@types": path.resolve(__dirname, "src/types"),
            "@utils": path.resolve(__dirname, "src/utils"),
        }

        // config.module.rules.push({
        //     test: /\.scss$/,
        //     use: [
        //         "style-loader",
        //         "css-loader",
        //         {
        //             loader: "sass-loader",
        //             options: {
        //                 additionalData: `
        //                     @import "@images";
        //                 `,
        //                 sassOptions: {
        //                     includePaths: [path.resolve(__dirname, "src/assets/images")],
        //                 },
        //             },
        //         },
        //     ],
        // })

        return config
    },
}

export default nextConfig
