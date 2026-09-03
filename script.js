const menu = document.querySelector('.menu');
const links = document.querySelector('nav ul');

if (menu && links) {
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const heroVisual = document.querySelector('.hero-visual');
const portrait = document.querySelector('.portrait');

if (heroVisual && portrait) {
  heroVisual.addEventListener('pointermove', (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portrait.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
  });

  heroVisual.addEventListener('pointerleave', () => {
    portrait.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

const skillConcepts = {
  Python: ['Variables and data types', 'Conditional statements and loops', 'Functions and modules', 'Lists, tuples, sets, and dictionaries', 'Object-oriented programming', 'File handling and exceptions', 'NumPy and Pandas basics'],
  Java: ['Variables and data types', 'Conditional statements and loops', 'Methods and classes', 'Object-oriented programming basics', 'Arrays and strings', 'Exception handling', 'Basic collections'],
  MySQL: ['Database and table design', 'SELECT, INSERT, UPDATE, DELETE', 'WHERE, ORDER BY, and GROUP BY', 'Joins and relationships', 'Aggregate functions', 'Subqueries', 'Constraints and indexes'],
  'Artificial Intelligence': ['AI fundamentals', 'Problem-solving and search', 'Knowledge representation', 'Supervised and unsupervised learning', 'Natural language processing basics', 'Computer vision basics', 'AI project workflow'],
  'Machine Learning': ['Data preparation', 'Feature selection', 'Regression', 'Classification', 'Clustering', 'Model evaluation', 'scikit-learn basics'],
  'Deep Learning': ['Neural network fundamentals', 'Perceptrons and activation functions', 'Forward and backward propagation', 'Convolutional neural networks', 'Recurrent neural networks', 'Training, validation, and testing', 'TensorFlow and Keras basics'],
  HTML: ['Semantic structure', 'Headings, paragraphs, and links', 'Images and accessibility', 'Forms and validation', 'Tables and lists', 'Audio and video', 'SEO-friendly markup'],
  CSS: ['Selectors and the cascade', 'Box model', 'Flexbox', 'CSS Grid', 'Responsive layouts', 'Transitions and animations', 'Colors, spacing, and typography'],
  JavaScript: ['Variables', 'Data Types', 'Operators', 'Input & Output', 'If-Else', 'Loops', 'Functions', 'Arrays', 'Objects', 'DOM & Events']
};

const skillDetail = document.querySelector('#skill-detail');
const detailTitle = document.querySelector('#detail-title');
const conceptsGrid = document.querySelector('#concepts-grid');

const showSkillDetail = (skill) => {
  if (!skillDetail || !detailTitle || !conceptsGrid) return;

  detailTitle.textContent = skill;
  conceptsGrid.innerHTML = skillConcepts[skill]
    .map(
      (concept, index) => `
        <div class="concept">
          <span class="mono">${String(index + 1).padStart(2, '0')}</span>
          <b>${concept}</b>
        </div>
      `
    )
    .join('');

  skillDetail.classList.add('active');
  skillDetail.scrollIntoView({ behavior: 'smooth' });
};

document.querySelectorAll('.skill').forEach((skill) => {
  skill.addEventListener('click', () => showSkillDetail(skill.dataset.skill));
  skill.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showSkillDetail(skill.dataset.skill);
    }
  });
});

document.querySelectorAll('.project[data-pdf]').forEach((project) => {
  const openProjectPdf = () => window.open(project.dataset.pdf, '_blank', 'noopener,noreferrer');
  project.addEventListener('click', openProjectPdf);
  project.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectPdf();
    }
  });
});

const backButton = document.querySelector('.skill-back');
if (backButton) {
  backButton.addEventListener('click', () => {
    if (skillDetail) {
      skillDetail.classList.remove('active');
    }
    document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' });
  });
}

document.querySelectorAll('.experience-switch button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.experience-switch button').forEach((tab) => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });

    document.querySelectorAll('.experience-panel').forEach((panel) => panel.classList.remove('active'));

    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');

    const panel = document.querySelector(`#${button.dataset.panel}`);
    if (panel) {
      panel.classList.add('active');
    }
  });
});

const contactForm = document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formStatus = document.querySelector('#form-status');
    if (formStatus) {
      formStatus.textContent = 'Thanks. Your message is ready to be connected.';
    }
    event.target.reset();
  });
}

const copyButton = document.querySelector('.copy-email');
const contactStatus = document.querySelector('#contact-status');

if (copyButton) {
  copyButton.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    const email = button.dataset.email;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else {
        const temporaryInput = document.createElement('input');
        temporaryInput.value = email;
        temporaryInput.setAttribute('readonly', '');
        temporaryInput.style.position = 'fixed';
        temporaryInput.style.left = '-9999px';
        document.body.appendChild(temporaryInput);
        temporaryInput.select();

        if (!document.execCommand('copy')) {
          throw new Error('Copy command was blocked');
        }

        temporaryInput.remove();
      }

      if (contactStatus) {
        contactStatus.textContent = 'Email copied.';
      }
    } catch {
      const emailLink = document.querySelector('.contact-column a[href^="mailto:"]');
      if (emailLink) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(emailLink);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      if (contactStatus) {
        contactStatus.textContent = 'Email selected. Press Ctrl+C to copy.';
      }
    }
  });
}

const emailLink = document.querySelector('.email-link');
if (emailLink) {
  emailLink.addEventListener('click', (event) => {
    event.preventDefault();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(event.currentTarget);
    selection.removeAllRanges();
    selection.addRange(range);

    if (contactStatus) {
      contactStatus.textContent = 'Email selected. Press Ctrl+C to copy.';
    }
  });
}
