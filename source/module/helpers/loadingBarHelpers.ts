export class LoadingBarHelpers {
    /**
     * Из полярной в прямоугольную систему координат
     * @param centerX
     * @param centerY
     * @param radius
     * @param angleInDegrees
     */
    static polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
        let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians)),
        };
    }

    /**
     * Получить параметры для дуги
     * @param x
     * @param y
     * @param radius
     * @param startAngle
     * @param endAngle
     */
    static describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
        let start = this.polarToCartesian(x, y, radius, endAngle);
        let end = this.polarToCartesian(x, y, radius, startAngle);

        let largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        let d = [
            'M', start.x, start.y,
            'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        ].join(' ');

        return d;
    }
}
