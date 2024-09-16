# domgoo

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Disclaimer](#disclaimer)

## About <a name = "about"></a>

This tool can be used to verify if a given account exists in a Google
Workspace. It does not perform any kind of brute force or login attempts.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

Ensure you have `node` and `git` installed.

### Installing

Clone this repo:

```
git clone https://github.com/y0k4i-1337/domgoo.git
```

Enter directory and install dependencies:

```
cd domgoo
yarn install
```

## Usage <a name = "usage"></a>

Help menu:

```
node domgoo.js -h
Usage: domgmail [options]

A DOM-based Google account enumerator

Options:
  -V, --version              output the version number
  -u, --username <email>     Single username to check
  -U, --usernames <file>     Path to the usernames file
  -i, --interval <ms>        Interval between enumeration attempts in milliseconds (default: 0)
  -H, --headless             Run in headless mode (default: false)
  -o, --output <outputFile>  Specify the output file name (default: "valid_accounts.txt")
  --test                     Test bot detection and take screenshot of the results (default: false)
  --typing-delay <ms>        Delay for typing in milliseconds (default: 100)
  -v, --verbose              Enable verbose output (default: false)
  -h, --help                 display help for command
```

## Disclaimer <a name = "disclaimer">

This tool is intended to be used for **educational** and **authorized penetration testing** purposes only. You are responsible for ensuring that you have **explicit permission** from the appropriate parties before using this tool on any system, network, or application.

Unauthorized access to computer systems is illegal and may result in severe penalties. The creators of this tool are not responsible for any misuse, illegal activities, or damage caused by the improper use of this tool.

By using this tool, you acknowledge that you understand and accept the following:

- You have obtained the necessary permissions to test the target system(s) or network(s).
- You are solely responsible for the actions performed using this tool.
- The creators of this tool disclaim any liability for legal consequences, damages, or losses incurred by using the tool.

Always use this tool in compliance with the relevant laws and ethical standards.
