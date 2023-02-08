import Refresh from "@mui/icons-material/Refresh";
import { Box, IconButton, Paper } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  forceCodeUpdate: () => Promise<void>;
  generatedCodeString: string;
}

export default function CodeBlock({ forceCodeUpdate, generatedCodeString }: CodeBlockProps) {
  return (
    <Box sx={{ width: "70%", margin: "30px auto", overflow: "hidden" }}>
      <IconButton sx={{ margin: "auto calc(100% - 40px)" }} onClick={forceCodeUpdate}>
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
