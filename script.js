
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        // remove active from all
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));

        // add active to clicked
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");

    });
});






const data = [
    {
        title: "Cognifyz Technologies",
        role: "Software Development Intern",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        points: [
            "Built Python applications",
            "Worked on quiz systems",
            "Improved debugging"
        ]
    },
    {
        title: "RogueCodes",
        role: "Frontend Developer Intern",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        points: [
            "Built React UI",
            "Improved UX",
            "Responsive design"
        ]
    },
    {
        title: "Projects",
        role: "Full Stack Development",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        points: [
            "MoonChat",
            "Crypto Tracker",
            "API + Deployment"
        ]
    }
];

const container = document.getElementById("cardContainer");

function createCard(d) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <div class="card-face front">
            <img src="${d.icon}">
            <h3>${d.title}</h3>
            <span>${d.role}</span>
        </div>

        <div class="card-face back">
            <h3>${d.title}</h3>
            <p>${d.role}</p>
            <ul>
                ${d.points.map(p => `<li>${p}</li>`).join("")}
            </ul>
        </div>
    `;

    card.addEventListener("click", () => handleClick(card));
    return card;
}

/* INITIAL LOAD */
data.forEach(d => container.appendChild(createCard(d)));

function handleClick(card) {
    card.classList.add("flipped");

    setTimeout(() => {
        card.classList.remove("flipped");

        /* MOVE TO BACK */
        container.appendChild(card);

    }, 1200);
}
