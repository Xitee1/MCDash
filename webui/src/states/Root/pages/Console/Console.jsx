import { dispatchCommand, request } from "@/common/utils/RequestUtil";
import React, {useRef, useEffect, useState} from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import "xterm/css/xterm.css";
import {Chip, IconButton, Stack, TextField, Typography} from "@mui/material";
import {Send} from "@mui/icons-material";

export const Console = () => {
    const terminalRef = useRef(null);
    const [command, setCommand] = useState("");

    useEffect(() => {
        const terminal = new Terminal({
            theme: { background: "rgba(0,0,0,0.25)" },
            fontSize: 14,
        });

        let currentLine = 0;

        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);

        terminal.open(terminalRef.current);
        fitAddon.fit();

        const updateConsole = () => {
            request("console/?startLine=" + currentLine).then(async (r) => {
                const lines = (await r.text()).split("\n");
                let lineAmount = lines.length;
                if (lines.length === 1 && lines[0] === "") return;

                if (currentLine === 0 && lines.length >= 100) lines.splice(0, lines.length - 100);

                lines.forEach((line) => terminal.writeln(line));

                currentLine += lineAmount;
            });
        };

        const interval = setInterval(() => {
            updateConsole();
        }, 2000);

        updateConsole();

        return () => {
            terminal.dispose();
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <Typography variant="h5" fontWeight={500}>Console <Chip label={"Test"}
                                                                           color="secondary"/></Typography>
            <div ref={terminalRef} style={{marginTop: "1rem"}}/>

            <Stack component="form" direction="row" alignItems="center" gap={1} sx={{mt: 3}} onSubmit={(e) => {
                e.preventDefault();
                dispatchCommand(command).then(() => setCommand(""));
            }}>
                <TextField value={command} required fullWidth label="Command"
                            autoFocus onChange={(e) => setCommand(e.target.value)}/>
                <IconButton variant="contained" type="submit">
                    <Send />
                </IconButton>
            </Stack>


        </>
    );
};