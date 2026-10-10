(() => {
  const config = window.PORTFOLIO_CONFIG || {};
  const projects = Array.isArray(config.projects) ? config.projects : [];
  if (!projects.length) return;

  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(window.location.search);
  const requestedSlug = params.get("project");
  let currentIndex = Math.max(0, projects.findIndex(p => p.slug === requestedSlug));
  if (projects.findIndex(p => p.slug === requestedSlug) < 0) currentIndex = 0;

  const homeUrl = config.portfolioHomeUrl || "#";
  ["back-link", "monogram"].forEach(id => {
    const link = $(id);
    link.href = homeUrl;
    link.addEventListener("click", (event) => {
      if (homeUrl === "#") {
        event.preventDefault();
        alert("Add your published Readymag homepage URL in js/projects.js first.");
      }
    });
  });

  function projectUrl(project) {
    return `${window.location.pathname}?project=${encodeURIComponent(project.slug)}`;
  }

  function setPreviewImage(element, project) {
    if (!element || !project) return;
    if (project.image) {
      element.style.backgroundImage = `url("${project.image.replace(/"/g, '\\"')}")`;
      element.classList.add("has-image");
      element.textContent = "";
    } else {
      element.style.backgroundImage = "";
      element.style.backgroundColor = project.accent || "#deded8";
      element.textContent = project.number || "";
    }
  }

  function render() {
    const project = projects[currentIndex];
    const previousIndex = currentIndex - 1;
    const nextIndex = currentIndex + 1;

    document.title = `${project.title} — Portfolio`;
    $("project-number").textContent = `${project.number || String(currentIndex + 1).padStart(2, "0")} / SELECTED WORK`;
    $("project-title").textContent = project.title;
    $("project-description").textContent = project.description || "";
    $("project-art-label").textContent = project.artLabel || project.title.toUpperCase();

    const art = $("project-art");
    art.style.backgroundColor = project.accent || "#e4e2dc";
    if (project.image) {
      art.style.backgroundImage = `url("${project.image.replace(/"/g, '\\"')}")`;
      art.classList.add("has-image");
    } else {
      art.style.backgroundImage = "none";
      art.classList.remove("has-image");
    }

    $("project-body").innerHTML = project.content || "";

    const previous = $("previous-project");
    const next = $("next-project");

    if (previousIndex >= 0) {
      const p = projects[previousIndex];
      previous.hidden = false;
      previous.href = projectUrl(p);
      $("previous-title").textContent = p.title;
      setPreviewImage($("previous-image"), p);
      previous.setAttribute("aria-label", `Previous project: ${p.title}`);
    } else {
      previous.hidden = true;
    }

    if (nextIndex < projects.length) {
      const p = projects[nextIndex];
      next.hidden = false;
      next.href = projectUrl(p);
      $("next-title").textContent = p.title;
      setPreviewImage($("next-image"), p);
      next.setAttribute("aria-label", `Next project: ${p.title}`);
    } else {
      next.hidden = true;
    }

    document.querySelectorAll(".project-nav").forEach(link => {
      link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const url = new URL(link.href, window.location.href);
        history.pushState({}, "", url);
        currentIndex = Math.max(0, projects.findIndex(p => p.slug === url.searchParams.get("project")));
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, { once: true });
    });
  }

  window.addEventListener("popstate", () => {
    const slug = new URLSearchParams(window.location.search).get("project");
    const index = projects.findIndex(p => p.slug === slug);
    currentIndex = index >= 0 ? index : 0;
    render();
    window.scrollTo({ top: 0, behavior: "auto" });
  });

  render();
})();
