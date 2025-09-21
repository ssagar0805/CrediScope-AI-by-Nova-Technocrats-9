# backend/mcp_server/__init__.py
"""
CrediScope MCP Server
Model Context Protocol server for Google APIs integration
"""

__version__ = "1.0.0"
__description__ = "MCP Server for CrediScope Google APIs"

# Import main server class and get_mcp_server function
from .server import CrediScopeMCPServer, get_mcp_server  # ✅ ADDED: get_mcp_server

# Import tool schemas
from .schemas.tool_schemas import (
    TOOL_SCHEMAS,
    get_tool_schema,
    get_all_tool_schemas,
    list_tool_names,
    validate_tool_exists
)

__all__ = [
    "CrediScopeMCPServer",
    "get_mcp_server",  # ✅ ADDED: Export get_mcp_server function
    "TOOL_SCHEMAS", 
    "get_tool_schema",
    "get_all_tool_schemas",
    "list_tool_names",
    "validate_tool_exists"
]
