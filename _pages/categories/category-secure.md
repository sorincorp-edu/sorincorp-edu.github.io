---
title: "Secure Coding"
layout: archive
permalink: categories/secure
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories['Secure Coding'] %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}