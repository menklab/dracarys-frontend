import Refresh from "@mui/icons-material/Refresh";
import { Box, IconButton, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  getGeneratedCode: () => Promise<string[]>;
}

export default function CodeBlock({ getGeneratedCode }: CodeBlockProps) {
  const [generatedCodeString, setGeneratedCodeString] = useState<string>("");

  const updateCode = async () => {
    const codeArray = await getGeneratedCode();
    let codeString = "";
    codeArray.forEach((str) => {
      codeString += str + "\n";
    });
    setGeneratedCodeString(codeString);
  };

  useEffect(() => {
    updateCode();
  }, []);

  return (
    <Box sx={{ width: "70%", margin: "30px auto", overflow: "hidden" }}>
      <IconButton sx={{ margin: "auto calc(100% - 40px)" }} onClick={updateCode}>
        <Refresh />
      </IconButton>
      <Paper elevation={3}>
        <SyntaxHighlighter
          language="rust"
          style={xonokai}
          customStyle={{ height: "calc(100vh - 195px)", minHeight: "250px" }}
        >
          {generatedCodeString}
        </SyntaxHighlighter>
      </Paper>
    </Box>
  );
}
