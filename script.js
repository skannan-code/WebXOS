let display;
let biggestIndex = 10;

document.addEventListener("DOMContentLoaded", () => {
    display = document.getElementById("display");
    const taskbarApps = document.getElementById("taskbar-apps-container");

    const iconMap = {
        "welcome": "https://img.freepik.com/free-photo/welcome-phrase-available-launch-open_53876-124476.jpg?semt=ais_hybrid&w=740&q=80",
        "notes": "https://cdn.neowin.com/news/images/uploaded/2021/12/1638903750_win_11_notepad_logo_not_16_by_9.jpg",
        "google": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1280px-Google_%22G%22_logo.svg.png",
        "calculator": "https://upload.wikimedia.org/wikipedia/commons/5/55/Windows_Calculator_icon.png",
        "IPHelpdesk": "https://thumbs.dreamstime.com/b/bright-flat-ip-address-icon-showing-network-identity-digital-connection-symbol-ip-address-flat-colored-icon-internet-416629931.jpg",
        "settings": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Windows_Settings_icon.svg/960px-Windows_Settings_icon.svg.png",
        "camera": "https://img.icons8.com/fluent/1200/camera.jpg"
    };

    function refreshTaskbar() {
        if (!taskbarApps) return;
        taskbarApps.innerHTML = "";
        document.querySelectorAll(".window").forEach(win => {
            if (win.style.display !== "none" || win.getAttribute("data-min") === "true") {
                let btn = document.createElement("button");
                btn.className = "taskbar-button";

                const appId = win.id;
                const iconUrl = iconMap[appId] || "";

                btn.innerHTML = `
                    <img src="${iconUrl}" style="width:70px; height:70px; border-radius:6px; vertical-align:middle;" alt = "icon">
                    <span style="vertical-align:middle;">${win.querySelector(".headertext")?.innerText || "App"}</span>
                `;

                if (win.style.display !== "none") btn.style.background = "white";

                btn.onclick = () => {
                    if (win.style.display === "none") {
                        win.style.display = "block";
                        win.setAttribute("data-min", "false");
                        win.style.zIndex = ++biggestIndex;
                    } else {
                        win.style.display = "none";
                        win.setAttribute("data-min", "true");
                    }
                    refreshTaskbar();
                };
                taskbarApps.appendChild(btn);
            }
        });
    }

    window.openWindow = function (el) {
        el.style.display = "block";
        el.setAttribute("data-min", "false");
        el.style.left = (window.innerWidth - el.offsetWidth) / 2 + "px";
        el.style.top = (window.innerHeight - el.offsetHeight) / 2 + "px";
        el.style.zIndex = ++biggestIndex;
        refreshTaskbar();
    };

    window.closeWindow = function (el) {
        el.style.display = "none";
        el.setAttribute("data-min", "false");
        refreshTaskbar();
    };

    window.minimizeWindow = function (el) {
        el.style.display = "none";
        el.setAttribute("data-min", "true");
        refreshTaskbar();
    };

    window.toggleMaximize = function (el) {
        if (!el.dataset.maximized) {
            el.dataset.prevLeft = el.style.left;
            el.dataset.prevTop = el.style.top;
            el.dataset.prevWidth = el.style.width;
            el.dataset.prevHeight = el.style.height;
            el.style.left = "0px";
            el.style.top = "40px";
            el.style.width = "100vw";
            el.style.height = "calc(100vh - 40px)";
            el.dataset.maximized = "true";
        } else {
            el.style.left = el.dataset.prevLeft;
            el.style.top = el.dataset.prevTop;
            el.style.width = el.dataset.prevWidth;
            el.style.height = el.dataset.prevHeight;
            el.dataset.maximized = "";
        }
    };

    window.appendValue = (v) => display.value += v;
    window.clearDisplay = () => display.value = "";
    window.backspace = () => display.value = display.value.slice(0, -1);
    window.calculate = () => {
        try { display.value = eval(display.value); } catch { display.value = "Error"; }
    };

    const windows = {
        welcome: document.getElementById("welcome"),
        notes: document.getElementById("notes"),
        google: document.getElementById("google"),
        calculator: document.getElementById("calculator"),
        IPHelpdesk: document.getElementById("IPHelpdesk"),
        settings: document.getElementById("settings"),
        camera: document.getElementById("camera")
    };

    document.getElementById("notesmin").onclick = () => minimizeWindow(windows.notes);
    document.getElementById("welcomemin").onclick = () => minimizeWindow(windows.welcome);
    document.getElementById("googlemin").onclick = () => minimizeWindow(windows.google);
    document.getElementById("calculatormin").onclick = () => minimizeWindow(windows.calculator);
    document.getElementById("IPHelpdeskmin").onclick = () => minimizeWindow(windows.IPHelpdesk);
    document.getElementById("settingsmin").onclick = () => minimizeWindow(windows.settings);
    document.getElementById("cameramin").onclick = () => minimizeWindow(windows.camera);

    document.getElementById("notesmax").onclick = () => toggleMaximize(windows.notes);
    document.getElementById("welcomemax").onclick = () => toggleMaximize(windows.welcome);
    document.getElementById("googlemax").onclick = () => toggleMaximize(windows.google);
    document.getElementById("calculatormax").onclick = () => toggleMaximize(windows.calculator);
    document.getElementById("IPHelpdeskmax").onclick = () => toggleMaximize(windows.IPHelpdesk);
    document.getElementById("settingsmax").onclick = () => toggleMaximize(windows.settings);
    document.getElementById("cameramax").onclick = () => toggleMaximize(windows.camera);

    document.getElementById("welcomeclose").onclick = () => closeWindow(windows.welcome);
    document.getElementById("welcomeopen").onclick = () => openWindow(windows.welcome);
    document.getElementById("notesclose").onclick = () => closeWindow(windows.notes);
    document.getElementById("notepadIcon").onclick = () => openWindow(windows.notes);
    document.getElementById("googleclose").onclick = () => closeWindow(windows.google);
    document.getElementById("googleIcon").onclick = () => openWindow(windows.google);
    document.getElementById("calculatorclose").onclick = () => closeWindow(windows.calculator);
    document.getElementById("calculatorIcon").onclick = () => openWindow(windows.calculator);
    document.getElementById("IPHelpdeskclose").onclick = () => closeWindow(windows.IPHelpdesk);
    document.getElementById("IPHelpdeskIcon").onclick = () => openWindow(windows.IPHelpdesk);
    document.getElementById("settingsclose").onclick = () => closeWindow(windows.settings);
    document.getElementById("settingsIcon").onclick = () => openWindow(windows.settings);

    document.getElementById("cameraclose").onclick = () => {
        closeWindow(windows.camera);
        stopCamera();
    };

    document.getElementById("cameraIcon").onclick = () => {
        openWindow(windows.camera);
        startCamera();
    };

    function makeDraggable(windowEl, headerEl) {
        let offsetX = 0, offsetY = 0, dragging = false;
        headerEl.addEventListener("pointerdown", (e) => {
            if (e.target.closest(".closebutton, .minbutton, .maxbutton")) return;
            dragging = true;
            offsetX = e.clientX - windowEl.offsetLeft;
            offsetY = e.clientY - windowEl.offsetTop;
            windowEl.style.zIndex = ++biggestIndex;
        });
        document.addEventListener("pointermove", (e) => {
            if (!dragging) return;
            windowEl.style.left = (e.clientX - offsetX) + "px";
            windowEl.style.top = (e.clientY - offsetY) + "px";
        });
        document.addEventListener("pointerup", () => dragging = false);
    }

    makeDraggable(windows.welcome, document.getElementById("welcomeheader"));
    makeDraggable(windows.notes, document.getElementById("notesheader"));
    makeDraggable(windows.google, document.getElementById("googleheader"));
    makeDraggable(windows.calculator, document.getElementById("calculatorheader"));
    makeDraggable(windows.IPHelpdesk, document.getElementById("IPHelpdeskheader"));
    makeDraggable(windows.settings, document.getElementById("settingsheader"));
    makeDraggable(windows.camera, document.getElementById("cameraheader"));

    openWindow(windows.welcome);

    const splash = document.getElementById("splash-screen");
    const unlockOS = () => {
        splash.classList.add("splash-hidden");
        document.body.classList.remove("locked");
    };

    const isLoggedIn = localStorage.getItem("webxos_loggedIn");

    if (isLoggedIn === "true") {
        unlockOS();
    } else {
        document.body.classList.add("locked");
    }

    window.setWallpaper = (url) => document.body.style.backgroundImage = `url('${url}')`;
    window.changeWallpaper = () => {
        const url = document.getElementById("wallpaperInput").value;
        if (url) setWallpaper(url);
    };

    const applyFilters = () => {
        const b = document.getElementById("brightnessRange").value;
        const c = document.getElementById("contrastRange").value;
        document.body.style.filter = `brightness(${b}%) contrast(${c}%)`;
    };
    document.getElementById("brightnessRange").addEventListener("input", applyFilters);
    document.getElementById("contrastRange").addEventListener("input", applyFilters);

    window.showSignup = function() {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("signupBox").style.display = "block";
    };

    window.showLogin = function() {
        document.getElementById("signupBox").style.display = "none";
        document.getElementById("loginPage").style.display = "block";
    };

    window.signup = function() {
        let user = document.getElementById("signupUser").value;
        let pass = document.getElementById("signupPass").value;

        if (!user || !pass) {
            document.getElementById("loginMessage").innerText = "Fill everything!";
            return;
        }

        localStorage.setItem("webxos_user", user);
        localStorage.setItem("webxos_pass", pass);

        document.getElementById("loginMessage").innerText = "Account created! Please login.";
        showLogin();
    };

    window.login = function() {
        let user = document.getElementById("loginUser").value;
        let pass = document.getElementById("loginPass").value;

        let savedUser = localStorage.getItem("webxos_user");
        let savedPass = localStorage.getItem("webxos_pass");

        if (user === savedUser && pass === savedPass) {
            localStorage.setItem("webxos_loggedIn", "true");
            unlockOS();
        } else {
            document.getElementById("loginMessage").innerText = "Wrong username or password!";
        }
    };

    window.logout = function() {
        localStorage.removeItem("webxos_loggedIn");
        location.reload();
    };

    let cameraStream = null;

    window.startCamera = async function () {
        try {
            const video = document.getElementById("cameraVideo");
            cameraStream = await navigator.mediaDevices.getUserMedia({video: true});
            video.srcObject = cameraStream;
        } catch (err) {
            alert("Camera access was denied or not available. Please fix this in your website settings.");
            console.error(err);
        }
    };

    window.stopCamera = function () {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
    };

    window.takePhoto = function () {
        const video = document.getElementById("cameraVideo");
        const canvas = document.getElementById("cameraCanvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        const image = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = image;
        link.download = "photo.png";
        link.click();
    };
});
