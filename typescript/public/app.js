import { formatTime } from './utils.js';

const app = document.getElementById("app");

async function apiRequest(url, options = {}) {
    try {
        const res = await fetch(url, options);
        const payload = await res.json();
        
        if (!res.ok) {
            return { data: null, error: payload.error || "An unexpected error occurred." };
        }
        return { data: payload, error: null };
    } catch (err) {
        return { data: null, error: "Network communication failure. Please check your connection." };
    }
}

function renderError(message, includeBackButton = true, heading = "") {
    app.innerHTML = `
        ${includeBackButton ? '<button data-href="/">← Back</button>' : ''}
        ${heading ? `<h2>${heading}</h2>` : ''}
        <p class="error-message"><strong>Error:</strong> ${message}</p>
    `;
}

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
    const { data: usecases, error } = await apiRequest("/api/usecases");

    if (error) {
        return renderError(error, false);
    }

    const html = usecases.length === 0 ? `
    <div>
        <p class="empty-state-message">No use cases recorded yet. Be the first to add one!</p>
    </div>
    ` : `
        <ul class="list">
            ${usecases.map(usecase => `
                <li>
                    <a href="/usecase/${usecase.id}" data-link>${usecase.title}</a>
                    <span class="meta">${usecase.aiTool} · ${usecase.timeSavedMinutes} min saved</span>
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
    const { data: usecase, error } = await apiRequest(`/api/usecases/${id}`);

    if (error) {
        return renderError(error);
    }

    app.innerHTML = `
        <button data-href="/">← Back</button>
        <article>
            <h2>${usecase.title}</h2>
            <p class="meta"><strong>AI tool:</strong> ${usecase.aiTool}</p>
            <p class="meta"><strong>Time saved:</strong> ${usecase.timeSavedMinutes} minutes</p>
            <p>${usecase.body}</p>
        </article>
    `;
}

async function renderStats() {
    const { data, error } = await apiRequest("/api/stats");

    if (error) {
        return renderError(error, true, "Stats");
    }

    const { overallTotalTimeSaved, timeSavedPerTool } = data;

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
            <p id="error-message" class="error-message"></p>
            <label>Title <input name="title"></label>
            <label>Body <textarea name="body"></textarea></label>
            <label>AI tool used <input name="aiTool"></label>
            <label>Time saved (minutes) <input name="timeSavedMinutes"></label>
            <button type="submit">Create</button>
        </form>
    `;

    const form = document.getElementById("create-form");
    const errorDiv = document.getElementById("error-message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorDiv.textContent = "";

        const formData = Object.fromEntries(new FormData(e.target));
        const { data, error } = await apiRequest("/api/usecases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (error) {
            errorDiv.textContent = error;
            return;
        }

        navigate(`/usecase/${data.id}`);
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