function windowSetting(score) {
    window.addEventListener('resize', function detect() {
        let width = window.innerWidth
        let height = window.innerHeight
        if (width < 800 || height < 700) {
            swal("視窗太小", "請調整你的視窗以由玩遊戲\n" +
                "需求寬度：750" + "需求高度：650\n" +
                "目前寬度： " + window.innerWidth + "\n" +
                "目前高度： " + window.innerHeight + "\n"
                , 'warning'
            ).then((value) => {
                    if (value === true && width >= 750 && height >= 650) {
                        if (score === 0)
                            window.removeEventListener('resize',detect)
                            init()
                    } else {
                        swal("視窗太小", "請調整你的視窗以由玩遊戲\n" +
                            "需求寬度：750" + "需求高度：650\n" +
                            "目前寬度： " + window.innerWidth + "\n" +
                            "目前高度： " + window.innerHeight + "\n"
                            , 'warning', {
                                button: false,
                                closeOnClickOutside: false,
                                closeOnEsc: false,
                            })
                    }
                })
        }
    })
}
