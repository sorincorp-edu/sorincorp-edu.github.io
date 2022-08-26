---
title: "ELK Stack"
layout: archive
permalink: categories/elk
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories['ELK Stack'] %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}