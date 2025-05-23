import { minidenticon } from "minidenticons"
import React, { ImgHTMLAttributes, useMemo } from "react"

interface IdentityIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
    username: string
    saturation?: string | number
    lightness?: string | number
}

const IdentityIcon: React.FC<IdentityIconProps> = ({ username, saturation, lightness, ...props }) => {
    const svgText = useMemo(() => minidenticon(username, saturation, lightness), [username, saturation, lightness])
    return <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`} alt={username} {...props} />
}

export default IdentityIcon