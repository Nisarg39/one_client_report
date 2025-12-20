# MCP Server Configuration

This project is configured with multiple MCP servers to enhance Claude Code capabilities for Next.js development.

## Configured MCP Servers

### 1. MCP Memory Keeper
[MCP Memory Keeper](https://github.com/mkreyman/mcp-memory-keeper) provides persistent memory storage across Claude Code sessions.

**Capabilities:**
- Store information across conversations
- Retrieve context from past sessions
- Maintain long-term knowledge about your projects and preferences
- Remember project-specific details, decisions, and patterns

### 2. Next.js DevTools MCP
[Next.js DevTools MCP](https://github.com/vercel/next-devtools-mcp) connects Claude to your running Next.js development server.

**Capabilities:**
- Detect and analyze build errors, runtime errors, and type errors
- Query live application state
- Inspect page metadata and routes
- Examine Server Actions
- Access Next.js 16+ built-in MCP endpoint at `http://localhost:3000/_next/mcp`

## Configuration

Both MCP servers are configured in **[.mcp.json](.mcp.json)** in the project root:

```json
{
  "mcpServers": {
    "memory-keeper": {
      "command": "npx",
      "args": ["-y", "mcp-memory-keeper"],
      "transport": "stdio",
      "env": {
        "DATA_DIR": "~/mcp-data/memory-keeper/",
        "MCP_MAX_TOKENS": "25000",
        "MCP_TOKEN_SAFETY_BUFFER": "0.8",
        "MCP_MIN_ITEMS": "1",
        "MCP_MAX_ITEMS": "100"
      }
    },
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"],
      "transport": "stdio"
    }
  }
}
```

## Environment Variables

### Memory Keeper
- **DATA_DIR**: Location where memory data is stored (`~/mcp-data/memory-keeper/`)
- **MCP_MAX_TOKENS**: Maximum tokens in responses (25000)
- **MCP_TOKEN_SAFETY_BUFFER**: Safety margin for token limits (0.8 = 80%)
- **MCP_MIN_ITEMS**: Minimum items to return (1)
- **MCP_MAX_ITEMS**: Maximum items per response (100)

### Next.js DevTools
No environment variables required - automatically discovers your running Next.js dev server.

## Data Storage

Memory data is stored in: `~/mcp-data/memory-keeper/`

This directory contains SQLite database files with conversation memories.

## Usage in Claude Code

Once configured, both MCP servers are automatically available in your Claude Code sessions.

### Memory Keeper Tools
Claude can:
- **Store memories**: Save important project information
- **Retrieve memories**: Access stored context from previous sessions
- **Update memories**: Modify existing stored information
- **Search memories**: Find relevant context based on queries

### Next.js DevTools Tools
Claude can:
- **Detect errors**: Automatically identify build, runtime, and type errors
- **Query state**: Inspect live application state while dev server is running
- **Inspect routes**: View page metadata and routing information
- **Debug Server Actions**: Examine Server Actions and their execution
- **Init tool**: Start every session with the `init` tool to set up proper Next.js context

**Important**: Make sure your Next.js dev server is running (`npm run dev`) for Next.js DevTools MCP to work!

## Verification

To verify the MCP servers are working:

1. **Restart Claude Code/your editor** to reload the configuration
2. **Type `/mcp`** in Claude Code to see available MCP servers
3. **Look for both servers**:
   - `memory-keeper` - Should always be available
   - `next-devtools` - Should show as connected when dev server is running
4. **Start your dev server**: Run `npm run dev` to enable Next.js DevTools MCP

## Troubleshooting

### MCP Servers Not Loading
- Ensure you have Node.js 16+ installed
- Run packages manually to test:
  - `npx mcp-memory-keeper`
  - `npx next-devtools-mcp@latest`
- Check Claude Code logs for error messages

### Memory Keeper Issues
- Verify `~/mcp-data/memory-keeper/` directory exists and is writable
- Run: `mkdir -p ~/mcp-data/memory-keeper`
- Clear npx cache: `npx clear-npx-cache`

### Next.js DevTools Issues
- **Dev server not running**: Start with `npm run dev`
- **Port conflicts**: Ensure Next.js is running on the default port (3000)
- **Next.js version**: This requires Next.js 16+ (MCP support is built-in)
- **Check endpoint**: Visit `http://localhost:3000/_next/mcp` to verify MCP endpoint is active

## Auto-Loading

Both MCP servers are configured to **automatically load** whenever you open this project in Claude Code because:

1. They're defined in [.mcp.json](.mcp.json) which is checked into version control
2. Claude Code automatically reads `.mcp.json` files in the project root on startup
3. No manual activation needed - they just work!

## Team Usage

Your team members will automatically get both MCP server configurations because:

1. The [.mcp.json](.mcp.json) file is committed to the repository
2. When they clone/pull the project, they get the configuration automatically
3. Claude Code will auto-load both servers when they open the project
4. They just need to run `npm run dev` to enable Next.js DevTools MCP features

## Additional Resources

### MCP Memory Keeper
- [MCP Memory Keeper GitHub](https://github.com/mkreyman/mcp-memory-keeper)
- [NPM Package](https://www.npmjs.com/package/mcp-memory-keeper)

### Next.js DevTools MCP
- [Next.js DevTools MCP GitHub](https://github.com/vercel/next-devtools-mcp)
- [NPM Package](https://www.npmjs.com/package/next-devtools-mcp)
- [Official Next.js MCP Guide](https://nextjs.org/docs/app/guides/mcp)

### General MCP Resources
- [Claude Code MCP Documentation](https://code.claude.com/docs/en/mcp.md)
- [Model Context Protocol](https://modelcontextprotocol.io/)
