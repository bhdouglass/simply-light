#pragma once

#include <pebble.h>

void layer_move(Layer *layer, int x, int y);
void text_layer_move(TextLayer *layer, int x, int y);

void layer_hide(Layer *layer);
void text_layer_hide(TextLayer *layer);

void layer_show(Layer *layer);
void text_layer_show(TextLayer *layer);

Layer *layer_init(Layer *window, GRect frame, LayerUpdateProc update_proc);
TextLayer *text_layer_init(Layer *window, GRect frame, GFont font, GColor background_color, GColor text_color, GTextAlignment alignment);

void layer_destroy_safe(Layer *layer);
void text_layer_destroy_safe(TextLayer *layer);

GFont fonts_load_resource_font(uint32_t resource_id);
void fonts_unload_custom_font_safe(GFont font);
