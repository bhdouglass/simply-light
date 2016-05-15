#pragma once

<%= constants %>

struct Config {
    int sunrise;
    int sunset;
<%= config_struct %>
};

void load_config();
void save_config();

struct Config config;
