---
layout: page
title: Contact
tagline: Create a contact form and you are good to go
ref: contact
order: 1
---

<div class="contact-icons">
  <a href="https://github.com/chanchann" target="_blank" class="contact-icon">
    <i class="fab fa-github"></i>
    <span>GitHub</span>
  </a>
  
  <a href="mailto:dzhen@xcypher.ai" class="contact-icon">
    <i class="fas fa-envelope"></i>
    <span>Email</span>
  </a>
  
  <a href="https://x.com/dzhen_xcypher" target="_blank" class="contact-icon">
    <i class="fab fa-twitter"></i>
    <span>X(Twitter)</span>
  </a>
</div>

<style>
.contact-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin: 30px 0;
}

.contact-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #0366d6;
  transition: transform 0.2s;
}

.contact-icon:hover {
  transform: translateY(-5px);
  color: #0245a3;
}

.contact-icon i {
  font-size: 2em;
  margin-bottom: 8px;
}

.contact-icon span {
  font-size: 0.9em;
}
</style>

[Go to the Home Page]({{ '/' | absolute_url }})
