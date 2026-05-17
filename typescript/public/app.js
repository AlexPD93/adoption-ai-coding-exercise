import { formatTime } from './utils.js';

const app = document.getElementById("app");

function navigate(path) {
    history.pushState({}, "", path);
    render();
}

async function render() {
    const path = location.pathname;
    if (path === "/" || path === "") {
        await renderList();
    } else if (path === "/stats") {
        await renderStats();
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

    if (!res.ok) {
        const { error } = await res.json();

        app.innerHTML = `
            <button data-href="/">← Back</button>
            <p style="color: red; margin-top: 20px;"><strong>Error:</strong> ${error}</p>
        `;
        return;
    }

    const usecases = await res.json();
    const html = usecases.length === 0 ? `
    <div>
        <p class="empty-state-message">No use cases recorded yet. Be the first to add one!</p>
    </div>
    ` : `
        <ul class="list">
            ${usecases.map(u => `
                <li>
                    <a href="/usecase/${u.id}" data-link>${u.title}</a>
                    <span class="meta">${u.ai_tool} · ${u.time_saved_minutes} min saved</span>
                </li>
            `).join("")}
        </ul>
    `;
    app.innerHTML = `
        <button data-href="/usecase/new">New use case</button>
        <button data-href="/stats">Stats</button>
        ${html}
    `;
}

async function renderView(id) {
    const res = await fetch(`/api/usecases/${id}`);

    if (!res.ok) {
        const { error } = await res.json();

        app.innerHTML = `
            <button data-href="/">← Back</button>
            <p style="color: red; margin-top: 20px;"><strong>Error:</strong> ${error}</p>
        `;
        return;
    }

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

async function renderStats() {
    const res = await fetch("/api/stats");

    if (!res.ok) {
        const { error } = await res.json();

        app.innerHTML = `
            <button data-href="/">← Back</button>
            <h2>Stats</h2>
            <p style="color: red; margin-top: 20px;"><strong>Error:</strong> ${error}</p>
        `;
        return;
    }

    const { overallTotalTimeSaved, timeSavedPerTool } = await res.json();
    app.innerHTML = `
        <button data-href="/">← Back</button>
        <h2>Stats</h2>
        <p class="meta"><strong>Total time saved:</strong> ${formatTime(overallTotalTimeSaved)}</p>
        <ul class="list">
            ${timeSavedPerTool.map(tool => `
                <li>
                    <p class="meta"><strong>${tool.aiTool}</strong></p>
                    <span class="meta">${formatTime(tool.totalTimeSaved)} saved</span>
                </li>
            `).join("")}
        </ul>
    `;
}

function renderCreate() {
    app.innerHTML = `
        <button data-href="/">← Back</button>
        <form id="create-form">
            <div id="error-message" style="color: red; margin-bottom: 10px;"></div>
            <label>Title <input name="title"></label>
            <label>Body <textarea name="body"></textarea></label>
            <label>AI tool used <input name="ai_tool"></label>
            <label>Time saved (minutes) <input name="time_saved_minutes"></label>
            <button type="submit">Create</button>
        </form>
    `;

    const form = document.getElementById("create-form");
    const errorDiv = document.getElementById("error-message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorDiv.textContent = "";

        const data = Object.fromEntries(new FormData(e.target));
        const res = await fetch("/api/usecases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const { error } = await res.json();
            errorDiv.textContent = error;
            return;
        }

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