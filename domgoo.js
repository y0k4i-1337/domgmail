const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const commander = require("commander");
const fs = require("fs");
const chalk = require("chalk");
const sleep = require("sleep-promise");
const path = require("path");
const { exit } = require("process");
const { executablePath } = require("puppeteer");

commander
    .name("domgmail")
    .description("A DOM-based Google account enumerator")
    .version("0.1")
    .option("-u, --username <email>", "Single username to check")
    .option("-U, --usernames <file>", "Path to the usernames file")
    .option(
        "-i, --interval <ms>",
        "Interval between enumeration attempts in milliseconds",
        0,
        parseInt
    )
    .option("-H, --headless", "Run in headless mode", false)
    .option(
        "-o, --output <outputFile>",
        "Specify the output file name",
        "valid_gmail.txt"
    )
    .option(
        "--test",
        "Test bot detection and take screenshot of the results",
        false
    )
    .option(
        "--typing-delay <ms>",
        "Delay for typing in milliseconds",
        100,
        parseInt
)
    .option(
        "-v, --verbose",
        "Enable verbose output",
        false
    )
    .parse();

const options = commander.opts();

// Validate options
if (!options.test && (!options.username && !options.usernames)) {
    console.error(chalk.red("Provide either a username or a usernames file."));
    process.exit(1);
}


// main code
(async () => {
    // Load the stealth plugin
    puppeteer.use(StealthPlugin());

    const browserOptions = {
        //args: [
        //"--no-sandbox",
        //"--disable-features=IsolateOrigins,site-per-process,SitePerProcess",
        //"--flag-switches-begin --disable-site-isolation-trials --flag-switches-end",
        //],
        headless: options.headless,
        // defaultViewport: null,
    };

    const browser = await puppeteer.launch(browserOptions);

    try {
        if (options.test) {
            console.log("Running tests...");
            const page = await browser.newPage();
            await page.setDefaultTimeout(15000);
            await page.goto("https://bot.sannysoft.com");
            await page.waitForNetworkIdle();
            await page.screenshot({ path: "testresult.png", fullPage: true });
            await browser.close();
            console.log(`All done, check the screenshot. ✨`);
            process.exit(0);
        }

        // Single username
        const usernames = [];
        if (options.username) {
            usernames.push(options.username.trim());
        }
        // Load usernames from file
        if (options.usernames) {
            const data = fs.readFileSync(options.usernames, "utf8");
            const lines = data.split("\n");
            for (const line of lines) {
                if (line) {
                    usernames.push(line.trim());
                }
            }
        }


        for (const username of usernames) {
            if (username === null || username === "") {
                continue;
            }

            const page = (await browser.pages())[0];
            // await page.setBypassCSP(true);
            // await page.setUserAgent(
            //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            // );
            try {


                await page.goto(
                    "https://accounts.google.com/AccountChooser/signinchooser?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&flowName=GlifWebSignIn&flowEntry=AccountChooser&ec=asw-gmail-globalnav-signin"
                );

                // Wait for the page to load
                // this will throw if selector is not found
                const emailSelector = await page.waitForSelector(
                    'input[type="email"]'
                );

                // Type into username box
                await emailSelector.type(username, {
                    delay: options.typingDelay,
                });
                await page.keyboard.press("Enter");

                await page.waitForNetworkIdle();

                // Check if username is wrong
                const result = await page.evaluate(() => {
                    const elements = Array.from(
                        document.querySelectorAll("span")
                    ).find((el) =>
                        el.textContent.match(
                            /Couldn.t find your Google Account/
                        )
                    );

                    if (elements) {
                        const computedStyle =
                            getComputedStyle(elements);
                        return (
                            computedStyle.display !== "none" &&
                            computedStyle.visibility !== "hidden"
                        );
                    }

                    return false;
                });
                if (result) {
                    if (options.verbose) {
                        console.debug(
                            `[-] Username ${username} not found!`
                        );
                    }
                } else {
                    // If we are here, the username is valid
                    fs.appendFileSync(options.output, `${username}\n`);
                    console.log(chalk.green(`[+] Valid username: ${username}`));
                }
            } catch (error) {
                fs.appendFileSync(
                    "incomplete_reqs.txt",
                    `${username}\n`
                );
                console.error(chalk.red(`[!] An error occurred: ${error}`));
            } finally {
                // clear browsing data
                const client = await page.target().createCDPSession();
                await client.send("Network.clearBrowserCookies");
                await client.send("Network.clearBrowserCache");
                await sleep(options.interval);
            }
        }
    } catch (error) {
        console.error(chalk.red(`[!] An error occurred: ${error}`));
    } finally {
        await browser.close();
        process.exit(0);
    }
})();
