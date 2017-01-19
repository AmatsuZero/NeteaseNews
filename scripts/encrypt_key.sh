#!/usr/bin/env bash
openssl aes-256-cbc -k ${ENCRYPT_PASS} -in scripts/MyAppdev.mobileprovision -out scripts/MyAppdev.mobileprovision.enc -a
openssl aes-256-cbc -k ${ENCRYPT_PASS} -in scripts/dist.cer -out scripts/dist.cer.enc -a
openssl aes-256-cbc -k ${ENCRYPT_PASS} -in scripts/dist.p12 -out scripts/dist.p12.enc -a