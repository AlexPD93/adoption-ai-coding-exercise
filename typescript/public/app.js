const app = document.getElementById("app");

function navigate(path) {
    history.pushState({}, "", path);
    render();
}

async function render() {
    const path = location.pathname;
    if (path === "/" || path === "") {
        await renderList();
    } else if (path === "/usecase/new") {
        renderCreate();
    } else if (path.startsWith("/usecase/")) {
        const id = path.slice("/usecase/".length);
        await renderView(id);
    } else {
        app.textContent = "Not found";
    }
}

async function renderList() {
    const res = await fetch("/api/usecases");
    const usecases = await res.json();
    app.innerHTML = `
        <button data-href="/usecase/new">New use case</button>
        <ul class="list">
            ${usecases.map(u => `
                <li>
                    <a href="/usecase/${u.id}" data-link>${u.title}</a>
                    <span class="meta">${u.ai_tool} · ${u.time_saved_minutes} min saved</span>
                </li>
            `).join("")}
        </ul>
    `;
}

async function renderView(id) {
    const res = await fetch(`/api/usecases/${id}`);
    const u = await res.json();
    app.innerHTML = `
        <button data-href="/">← Back</button>
        <article>
            <h2>${u.title}</h2>
            <p class="meta"><strong>AI tool:</strong> ${u.ai_tool}</p>
            <p class="meta"><strong>Time saved:</strong> ${u.time_saved_minutes} minutes</p>
            <p>${u.body}</p>
        </article>
    `;
}

function renderCreate() {
    app.innerHTML = `
        <button data-href="/">← Back</button>
        <form id="create-form">
            <label>Title <input name="title"></label>
            <label>Body <textarea name="body"></textarea></label>
            <label>AI tool used <input name="ai_tool"></label>
            <label>Time saved (minutes) <input name="time_saved_minutes"></label>
            <button type="submit">Create</button>
        </form>
    `;
    document.getElementById("create-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        const res = await fetch("/api/usecases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const { id } = await res.json();
        navigate(`/usecase/${id}`);
    });
}

document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-link]");
    if (link) {
        e.preventDefault();
        navigate(link.getAttribute("href"));
        return;
    }
    const btn = e.target.closest("button[data-href]");
    if (btn) {
        e.preventDefault();
        navigate(btn.getAttribute("data-href"));
    }
});

window.addEventListener("popstate", render);
render();
