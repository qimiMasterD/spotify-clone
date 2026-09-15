function showToast(message, type, duration = 3000) {
    const container = document.querySelector("#toast-container");
    const toast = document.createElement("div");
    toast.className = `custom-toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);

    void toast.offsetWidth;
    toast.classList.add("show");

    const dismiss = () => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 300);
    };

    const timer = setTimeout(dismiss, duration);

    toast.addEventListener("click", () => {
        clearTimeout(timer);
        dismiss();
    });
}

export default showToast;
