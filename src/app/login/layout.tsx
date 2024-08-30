import Image from "next/image"
import SocialLogin from "./layout/SocialLogin"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="login">
            <div className="login__inner">
                <div className="login__title">
                    <div className="login__title__logo">
                        <Image src="/images/logo.png" alt="로고 이미지" width={45} height={32} />
                        <span className="typo t16">실시간 동시통역 서비스</span>
                    </div>
                    <div className="login__title__text">
                        <p className="typo t56 w600">LOGIN</p>
                    </div>
                </div>
                {children}
                <SocialLogin />
            </div>
        </div>
    )
}
