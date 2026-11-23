const compare = document.getElementById("comparison");
const reveal = document.getElementById("reveal");

function updateComparison() {
  const amount = reveal.value + "%";
  compare.style.setProperty("--reveal", amount);
  reveal.setAttribute("aria-valuetext", amount + " original scene");
}

reveal.addEventListener("input", updateComparison);
updateComparison();

const cities = {
  "01": { meshes: "2,310", views: "48,048", building: "02041" },
  "02": { meshes: "2,355", views: "48,061", building: "01431" },
  "03": { meshes: "2,282", views: "48,236", building: "00679" },
  "04": { meshes: "2,315", views: "48,215", building: "00326" },
};

const tabs = Array.from(document.querySelectorAll("[data-city]"));
const cityPanel = document.getElementById("city-panel");
const cityImage = document.getElementById("city-image");
const cityName = document.getElementById("city-name");
const cityCount = document.getElementById("city-count");
const caseName = document.getElementById("case-name");
const caseImages = ["rgb", "points", "mesh"].map(
  (kind) => [kind, document.getElementById("case-" + kind)]
);

function selectCity(tab) {
  const id = tab.dataset.city;
  const city = cities[id];
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  cityPanel.setAttribute("aria-labelledby", tab.id);
  cityImage.src = "media/city-" + id + ".jpg";
  cityImage.alt = "Aerial overview of City " + id;
  cityName.textContent = "City " + id;
  cityCount.textContent = city.meshes + " reference meshes · " + city.views + " aerial views";
  caseName.textContent = "Building " + city.building;
  caseImages.forEach(([kind, image]) => {
    image.src = "media/case-" + id + "-" + kind + ".jpg";
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectCity(tab));
  tab.addEventListener("keydown", (event) => {
    const targets = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(event.key in targets)) return;
    const next = tabs[targets[event.key]];
    event.preventDefault();
    selectCity(next);
    next.focus();
  });
});

const copy = document.getElementById("copy-bib");
const bibtex = document.getElementById("bibtex");
const copyStatus = document.getElementById("copy-status");
let resetCopy;

copy.addEventListener("click", async () => {
  clearTimeout(resetCopy);
  try {
    await navigator.clipboard.writeText(bibtex.textContent + "\n");
    copy.textContent = "Copied";
    copyStatus.textContent = "BibTeX copied.";
  } catch {
    const citation = document.createRange();
    citation.selectNodeContents(bibtex);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(citation);
    copy.textContent = "Selected";
    copyStatus.textContent = "BibTeX selected. Use your keyboard to copy it.";
  }
  resetCopy = setTimeout(() => {
    copy.textContent = "Copy";
    copyStatus.textContent = "";
  }, 2200);
});
