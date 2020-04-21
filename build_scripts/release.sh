#!/bin/bash

set -Ceu

script_dir=$(cd "$(dirname "${0}")";pwd)


#----------------------------------------------------
version=${1}

echo "target version: ${version}"


#----------------------------------------------------
project_dir="${script_dir}/.."
dist_dir="${script_dir}/../_dist/${version}"
release_dir="${script_dir}/../_release"

mkdir -p "${release_dir}"


#----------------------------------------------------
echo "[mac] BEGIN"

mac_src="${dist_dir}/mac/TinyMarkdownServer.app"
mac_work_dir="TinyMarkdownServer-${version}-mac"
mac_zip="TinyMarkdownServer-${version}-mac.zip"

if [ ! -d "${mac_src}" ]; then
  echo "The mac .app dir not found: ${mac_src}"
  exit
fi

cd "${release_dir}"
rm -rf "${mac_work_dir}"
mkdir "${mac_work_dir}"

cd "${release_dir}/${mac_work_dir}"
cp -r "${mac_src}" "TinyMarkdownServer-${version}.app"
cp "${project_dir}/LICENSE.txt" .
cp "${project_dir}/LICENSE.third_party.txt" .

cd "${release_dir}"
rm -f "${mac_zip}"
zip -r "${mac_zip}" "${mac_work_dir}"

rm -rf "${mac_work_dir}"

echo "[mac] END"


#----------------------------------------------------
echo "[win] BEGIN"

win_exe="${dist_dir}/TinyMarkdownServer ${version}.exe"
win_work_dir="TinyMarkdownServer-${version}-win"
win_zip="TinyMarkdownServer-${version}-win.zip"

if [ ! -f "${win_exe}" ]; then
    echo "The win exe file found: ${win_exe}"
    exit
fi

cd "${release_dir}"
rm -rf "${win_work_dir}"
mkdir "${win_work_dir}"

cd "${release_dir}/${win_work_dir}"
cp "${win_exe}" "TinyMarkdownServer-${version}.exe"
cp "${project_dir}/LICENSE.txt" .
cp "${project_dir}/LICENSE.third_party.txt" .

cd "${release_dir}"
rm -f "${win_zip}"
zip -r "${win_zip}" "${win_work_dir}"

rm -rf "${win_work_dir}"

echo "[win] END"
