// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::process::Command;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn exec(value: &str) -> String {
    String::from_utf8(
        Command::new(value)
            .output()
            .expect("failed to execute process")
            .stdout,
    )
    .unwrap()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![exec])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
