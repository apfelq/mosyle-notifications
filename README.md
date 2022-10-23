# MOSYLE-NOTIFICATION

A small utility to query the Mosyle MDM API and send notifications based on parameters.

## 1. Requirements

- A working nodejs installation
## 2. Installation

```bash
cd ~/dir/of/your/choice
git clone https://github.com/apfelq/mosyle-notification
cd mosyle-notification
npm ci
```

## 3. Configuration

The tool expects 3 files:

- `config.yaml` (setup mail account)

Have a look at

- `config.example.yaml`

on how to set them up.

### 3.1 config

Add a mail account in a format `nodemailer` supports.

## 4. Execute

Simply execute the script by typing `npm start` or `./mosyle-notification.sh`.