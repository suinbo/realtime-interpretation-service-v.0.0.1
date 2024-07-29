import React, { useRef } from "react"

/**
 * 볼륨 값 정수로 정규화
 * @param volume 0 ~ 1 사이의 실수
 * @param min 정수
 * @param max 정수
 * @returns
 */
const normalizeToInteger = (volume: number, min: number, max: number) => {
    const scaledValue = Math.min(max, Math.max(min, volume * (max - min) + min))
    return Math.round(scaledValue)
}

/**
 * 볼륨 미터 관리
 * @returns
 */
export const useVolumeMeter = () => {
    const volumeBarsRef = useRef(Array.from({ length: 30 }, () => React.createRef<HTMLDivElement>()))

    const colorVolumeMeter = (volume: number) => {
        const VOL_METER_MAX = 30

        volumeBarsRef.current.forEach(ref => {
            if (ref.current) {
                ref.current.style.backgroundColor = "#e6e6e6"
            }
        })

        const numberOfChildToColor = normalizeToInteger(volume, 0, VOL_METER_MAX)
        const coloredChild = volumeBarsRef.current.slice(0, numberOfChildToColor)

        coloredChild.forEach(ref => {
            if (ref.current) {
                ref.current.style.backgroundColor = "#ffd84f"
            }
        })
    }

    return {
        volumeBarsRef: volumeBarsRef.current,
        colorVolumeMeter,
    }
}
