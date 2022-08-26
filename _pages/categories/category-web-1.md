---
title: "웹개발 기초"
layout: archive
permalink: categories/web-1
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories.web-1 %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}