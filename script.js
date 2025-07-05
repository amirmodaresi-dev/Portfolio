document.addEventListener("DOMContentLoaded", () => {
  function initializePage() {
    setupPreloader();
    initializeNavigation();
    setupScrollAnimations();
    initializeParticleCanvas();
    initializeCardTilt();
    initializeTaskManager();
    initializeKeywordAnalyzer();
  }

  function setupPreloader() {
    const preloader = document.querySelector(".preloader");
    if (!preloader) return;

    window.addEventListener("load", () => {
      preloader.classList.add("hidden");
      document.body.classList.add("loaded");
    });
  }

  function initializeNavigation() {
    const navbar = document.querySelector(".navbar");
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (!navbar) return;

    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    });

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        navMenu.classList.toggle("active");
      });
    }

    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");

        if (navMenu && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active");
        }

        if (targetId === "#") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      });
    });
  }

  function initializeTypingEffect() {
    const typingSpan = document.getElementById("typing-span");
    if (!typingSpan) return;

    const roles = ["Frontend Developer", "AI Specialist", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentRole = roles[roleIndex];
      typingSpan.textContent = currentRole.substring(0, charIndex);

      if (!isDeleting && charIndex < currentRole.length) {
        charIndex++;
        setTimeout(type, 150);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, 75);
      } else if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(type, 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 500);
      }
    }
    type();
  }

  function setupScrollAnimations() {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay) || 0;
            setTimeout(() => {
              entry.target.classList.add("animate");
            }, delay);
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll("[data-animation]")
      .forEach((el) => scrollObserver.observe(el));
  }

  function initializeCardTilt() {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = (y / rect.height) * -10;
        const rotateY = (x / rect.width) * 10;

        card.style.setProperty("--rotateX", `${rotateX}deg`);
        card.style.setProperty("--rotateY", `${rotateY}deg`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--rotateX", "0deg");
        card.style.setProperty("--rotateY", "0deg");
      });
    });
  }

  function initializeParticleCanvas() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particlesArray;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    class Particle {
      constructor(x, y, dirX, dirY, size) {
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.size = size;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.2)";
        ctx.fill();
      }
      update() {
        if (this.x < 0 || this.x > canvas.width) this.dirX = -this.dirX;
        if (this.y < 0 || this.y > canvas.height) this.dirY = -this.dirY;
        this.x += this.dirX;
        this.y += this.dirY;
        this.draw();
      }
    }

    const initParticles = () => {
      particlesArray = [];
      const numberOfParticles = (canvas.width * canvas.height) / 12000;
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const dirX = Math.random() * 0.4 - 0.2;
        const dirY = Math.random() * 0.4 - 0.2;
        particlesArray.push(new Particle(x, y, dirX, dirY, size));
      }
    };

    const connectParticles = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = dx * dx + dy * dy;

          if (distance < (canvas.width / 8) * (canvas.height / 8)) {
            const opacity = 1 - distance / 20000;
            ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((p) => p.update());
      connectParticles();
    };

    window.addEventListener("resize", () => {
      setCanvasSize();
      initParticles();
    });

    initParticles();
    animate();
    initializeTypingEffect();
  }

  function initializeKeywordAnalyzer() {
    const analyzeBtn = document.getElementById("analyze-text-btn");
    if (analyzeBtn) {
      analyzeBtn.addEventListener("click", handleTextAnalysis);
    }
  }

  function handleTextAnalysis() {
    const textArea = document.getElementById("text-input-area");
    const resultsContainer = document.getElementById(
      "analysis-results-container"
    );
    const text = textArea.value;

    if (!text.trim()) {
      resultsContainer.innerHTML = `<p class="placeholder-text">Please paste some text to analyze.</p>`;
      return;
    }

    resultsContainer.innerHTML = '<div class="loader"></div>';

    setTimeout(() => {
      const analysis = analyzeText(text);
      renderAnalysisResults(analysis, resultsContainer);
    }, 500);
  }

  function analyzeText(text) {
    const skillKeywords = {
      "Frontend Development": [
        "html",
        "css",
        "javascript",
        "es6",
        "react",
        "vue",
        "angular",
        "sass",
        "responsive design",
        "frontend",
        "ui",
        "ux",
      ],
      "Artificial Intelligence": [
        "ai",
        "machine learning",
        "ml",
        "neural networks",
        "tensorflow",
        "pytorch",
        "nlp",
        "computer vision",
        "artificial intelligence",
      ],
      "Tools & Workflow": [
        "git",
        "github",
        "python",
        "problem solving",
        "teamwork",
        "agile",
        "scrum",
        "docker",
        "webpack",
        "ci/cd",
      ],
    };

    const foundSkills = {};
    const lowerCaseText = text.toLowerCase();
    let totalSkillMentions = 0;

    for (const category in skillKeywords) {
      foundSkills[category] = {
        keywords: new Set(),
        count: 0,
      };

      skillKeywords[category].forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword.replace("+", "\\+")}\\b`, "gi");
        const matches = lowerCaseText.match(regex);
        if (matches) {
          foundSkills[category].keywords.add(keyword);
          foundSkills[category].count += matches.length;
          totalSkillMentions += matches.length;
        }
      });
    }

    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(words / 200);

    return {
      stats: { wordCount: words, readingTime },
      skills: foundSkills,
      totalSkillMentions,
    };
  }

  function renderAnalysisResults(analysis, container) {
    container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "analysis-grid";

    const statsCard = document.createElement("div");
    statsCard.className = "stats-card";
    statsCard.innerHTML = `
      <h3>Text Statistics</h3>
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-value">${analysis.stats.wordCount}</div>
          <div class="stat-label">Words</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${analysis.stats.readingTime}</div>
          <div class="stat-label">Min Read</div>
        </div>
      </div>
    `;

    const skillsCard = document.createElement("div");
    skillsCard.className = "skills-card";
    skillsCard.innerHTML = "<h3>Skill Analysis</h3>";

    for (const category in analysis.skills) {
      const categoryData = analysis.skills[category];
      const percentage =
        analysis.totalSkillMentions > 0
          ? (categoryData.count / analysis.totalSkillMentions) * 100
          : 0;

      const categoryDiv = document.createElement("div");
      categoryDiv.className = "skill-category-analysis";
      categoryDiv.innerHTML = `
        <div class="skill-category-title">
          <span>${category}</span>
          <span>${categoryData.count} mentions</span>
        </div>
        <div class="skill-bar-container">
          <div class="skill-bar" style="width: 0%;" data-width="${percentage.toFixed(
            2
          )}%"></div>
        </div>
      `;

      if (categoryData.keywords.size > 0) {
        const keywordsContainer = document.createElement("div");
        keywordsContainer.className = "found-keywords-container";
        categoryData.keywords.forEach((keyword) => {
          const tag = document.createElement("span");
          tag.className = "keyword-tag";
          tag.textContent = keyword;
          keywordsContainer.appendChild(tag);
        });
        categoryDiv.appendChild(keywordsContainer);
      }

      skillsCard.appendChild(categoryDiv);
    }

    grid.appendChild(statsCard);
    grid.appendChild(skillsCard);
    container.appendChild(grid);

    setTimeout(() => {
      document.querySelectorAll(".skill-bar").forEach((bar) => {
        bar.style.width = bar.dataset.width;
      });
    }, 100);
  }

  function initializeTaskManager() {
    const setupModal = (triggerId, modalId) => {
      const trigger = document.getElementById(triggerId);
      const modal = document.getElementById(modalId);
      if (!trigger || !modal) return;

      const closeBtn = modal.querySelector(".modal-close");
      trigger.addEventListener("click", () => modal.classList.add("visible"));
      closeBtn.addEventListener("click", () =>
        modal.classList.remove("visible")
      );
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("visible");
      });
    };
    setupModal("task-manager-demo-btn", "task-manager-modal");

    const taskForm = document.getElementById("task-form");
    if (!taskForm) return;

    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const filterContainer = document.querySelector(".task-manager-filters");
    const STORAGE_KEY = "tasks-v18-en";
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let currentFilter = "all";

    const saveTasks = () =>
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    const renderTasks = () => {
      const filtered = tasks.filter((t) => {
        if (currentFilter === "active") return !t.completed;
        if (currentFilter === "completed") return t.completed;
        return true;
      });

      taskList.innerHTML = "";
      if (filtered.length === 0) {
        taskList.innerHTML = `<li class="empty-task-list">No tasks here yet!</li>`;
        return;
      }

      filtered.forEach((task) => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;
        li.dataset.id = task.id;
        li.innerHTML = `
            <label class="task-item-checkbox">
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <span class="checkmark"><i class="fas fa-check"></i></span>
            </label>
            <span class="task-item-text">${task.text}</span>
            <button class="delete-btn" aria-label="Delete task"><i class="fas fa-trash-alt"></i></button>
        `;
        taskList.appendChild(li);
      });
    };

    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = taskInput.value.trim();
      if (text) {
        tasks.unshift({ id: Date.now(), text, completed: false });
        saveTasks();
        renderTasks();
        taskInput.value = "";
      }
    });

    taskList.addEventListener("click", (e) => {
      const parentLi = e.target.closest(".task-item");
      if (!parentLi) return;
      const taskId = Number(parentLi.dataset.id);

      if (e.target.closest(".delete-btn")) {
        tasks = tasks.filter((t) => t.id !== taskId);
      } else {
        const task = tasks.find((t) => t.id === taskId);
        if (task) task.completed = !task.completed;
      }
      saveTasks();
      renderTasks();
    });

    filterContainer.addEventListener("click", (e) => {
      if (e.target.matches(".filter-btn")) {
        currentFilter = e.target.dataset.filter;
        filterContainer.querySelector(".active").classList.remove("active");
        e.target.classList.add("active");
        renderTasks();
      }
    });

    document
      .getElementById("task-manager-demo-btn")
      .addEventListener("click", renderTasks);
  }

  initializePage();
});
