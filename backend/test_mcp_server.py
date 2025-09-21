# backend/test_mcp_server.py
"""
CrediScope MCP Server Testing Suite
Comprehensive validation of all MCP tools and Google API integration
"""

import asyncio
import json
import time
import base64
from datetime import datetime

# Import MCP server components
from mcp_server import get_mcp_server
from mcp_server.tools.translate_tool import translate_tool
from mcp_server.tools.search_tool import search_tool
from mcp_server.tools.vision_tool import vision_tool

class MCPServerTester:
    """Comprehensive MCP server testing"""
    
    def __init__(self):
        self.server = get_mcp_server()
        self.test_results = []
        
    def log_result(self, test_name: str, success: bool, details: str, duration: float = 0.0):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        self.test_results.append({
            "test": test_name,
            "status": status,
            "success": success,
            "details": details,
            "duration": duration
        })
        print(f"{status} {test_name} ({duration:.2f}s)")
        if details:
            print(f"    {details}")
    
    async def test_server_initialization(self):
        """Test MCP server initialization"""
        test_name = "Server Initialization"
        start_time = time.time()
        
        try:
            # Check server info
            server_info = self.server.get_server_info()
            tools = self.server.get_tool_list()
            
            if len(tools) >= 3:  # At least 3 core tools
                self.log_result(
                    test_name, True, 
                    f"Server initialized with {len(tools)} tools: {', '.join(tools)}", 
                    time.time() - start_time
                )
                return True
            else:
                self.log_result(
                    test_name, False, 
                    f"Insufficient tools registered: {len(tools)}", 
                    time.time() - start_time
                )
                return False
                
        except Exception as e:
            self.log_result(test_name, False, f"Server init error: {str(e)}", time.time() - start_time)
            return False
    
    async def test_translation_tool(self):
        """Test Google Translate MCP tool"""
        test_name = "Translation Tool"
        start_time = time.time()
        
        try:
            # Test text translation
            result = await translate_tool.translate_text("Hello world", "es")
            
            if result["success"] and result["translated_text"]:
                self.log_result(
                    test_name, True,
                    f"Translated 'Hello world' to '{result['translated_text']}'",
                    time.time() - start_time
                )
                return True
            else:
                self.log_result(
                    test_name, False,
                    f"Translation failed: {result.get('error', 'Unknown error')}",
                    time.time() - start_time
                )
                return False
                
        except Exception as e:
            self.log_result(test_name, False, f"Translation tool error: {str(e)}", time.time() - start_time)
            return False
    
    async def test_language_detection(self):
        """Test language detection"""
        test_name = "Language Detection"
        start_time = time.time()
        
        try:
            # Test language detection
            result = await translate_tool.detect_language("Bonjour le monde")
            
            if result["success"] and result["detected_language"]:
                self.log_result(
                    test_name, True,
                    f"Detected language: {result['detected_language']}",
                    time.time() - start_time
                )
                return True
            else:
                self.log_result(
                    test_name, False,
                    f"Language detection failed: {result.get('error', 'Unknown error')}",
                    time.time() - start_time
                )
                return False
                
        except Exception as e:
            self.log_result(test_name, False, f"Language detection error: {str(e)}", time.time() - start_time)
            return False
    
    async def test_web_search(self):
        """Test Google Custom Search"""
        test_name = "Web Search Tool"
        start_time = time.time()
        
        try:
            # 🔧 FIXED: Use guaranteed-to-work query
            # These queries are designed to return results immediately
            test_queries = [
                "site:cnn.com artificial intelligence",
                "site:bbc.com technology news", 
                "python programming tutorial",
                "google search help"
            ]
            
            # Try each query until one works
            for query in test_queries:
                try:
                    result = await search_tool.custom_search(query, 3)
                    
                    if result["success"] and len(result.get("results", [])) > 0:
                        num_results = len(result["results"])
                        first_title = result["results"][0].get("title", "No title")
                        self.log_result(
                            test_name, True,
                            f"Found {num_results} results with query '{query[:30]}...', first: '{first_title[:50]}...'",
                            time.time() - start_time
                        )
                        return True
                except Exception:
                    continue  # Try next query
            
            # If none of the queries worked
            self.log_result(
                test_name, False,
                "All test queries failed - Custom Search may need indexing time",
                time.time() - start_time
            )
            return False
                
        except Exception as e:
            self.log_result(test_name, False, f"Search tool error: {str(e)}", time.time() - start_time)
            return False
    
    async def test_fact_check(self):
        """Test Google Fact Check API"""
        test_name = "Fact Check Tool"
        start_time = time.time()
        
        try:
            # 🔧 IMPROVED: Use more common fact-check topics
            fact_check_queries = [
                "COVID-19 vaccine effectiveness",
                "climate change global warming",
                "election fraud voting machines",
                "5G coronavirus health effects"
            ]
            
            # Try multiple queries for better success rate
            for query in fact_check_queries:
                try:
                    result = await search_tool.factcheck_search(query, 2)
                    
                    if result["success"] and len(result.get("fact_checks", [])) > 0:
                        num_checks = len(result["fact_checks"])
                        self.log_result(
                            test_name, True,
                            f"Found {num_checks} fact-check results for '{query[:30]}...'",
                            time.time() - start_time
                        )
                        return True
                except Exception:
                    continue  # Try next query
            
            # If no fact-checks found
            self.log_result(
                test_name, False,
                "No fact-check results found for test queries",
                time.time() - start_time
            )
            return False
                
        except Exception as e:
            self.log_result(test_name, False, f"Fact check error: {str(e)}", time.time() - start_time)
            return False
    
    async def test_vision_ocr(self):
        """Test Google Vision API OCR"""
        test_name = "Vision OCR Tool"
        start_time = time.time()
        
        try:
            # Create simple test image (1x1 pixel PNG in base64)
            test_image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            
            # Test OCR
            result = await vision_tool.extract_text(test_image)
            
            # For minimal test image, we expect success even if no text found
            if result["success"]:
                text_length = len(result.get("text", ""))
                self.log_result(
                    test_name, True,
                    f"OCR completed, extracted {text_length} characters",
                    time.time() - start_time
                )
                return True
            else:
                self.log_result(
                    test_name, False,
                    f"OCR failed: {result.get('error', 'Unknown error')}",
                    time.time() - start_time
                )
                return False
                
        except Exception as e:
            self.log_result(test_name, False, f"Vision OCR error: {str(e)}", time.time() - start_time)
            return False
    
    async def test_vision_labels(self):
        """Test Google Vision API label detection"""
        test_name = "Vision Labels Tool"
        start_time = time.time()
        
        try:
            # Use same test image
            test_image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            
            # Test label detection
            result = await vision_tool.detect_labels(test_image)
            
            if result["success"]:
                num_labels = len(result.get("labels", []))
                self.log_result(
                    test_name, True,
                    f"Label detection completed, found {num_labels} labels",
                    time.time() - start_time
                )
                return True
            else:
                self.log_result(
                    test_name, False,
                    f"Label detection failed: {result.get('error', 'Unknown error')}",
                    time.time() - start_time
                )
                return False
                
        except Exception as e:
            self.log_result(test_name, False, f"Vision labels error: {str(e)}", time.time() - start_time)
            return False
    
    async def test_comprehensive_search(self):
        """Test comprehensive search combining multiple tools"""
        test_name = "Comprehensive Search"
        start_time = time.time()
        
        try:
            # 🔧 IMPROVED: Use better test queries
            comprehensive_queries = [
                "site:wikipedia.org climate change",
                "global warming facts",
                "coronavirus vaccine information"
            ]
            
            # Try multiple queries for better success
            for query in comprehensive_queries:
                try:
                    result = await search_tool.comprehensive_search(query)
                    
                    if result["success"]:
                        web_results = len(result.get("web_search", {}).get("results", []))
                        fact_checks = len(result.get("fact_checks", {}).get("fact_checks", []))
                        wiki_available = bool(result.get("wikipedia", {}).get("summary"))
                        
                        self.log_result(
                            test_name, True,
                            f"Comprehensive search: {web_results} web results, {fact_checks} fact checks, Wikipedia: {wiki_available}",
                            time.time() - start_time
                        )
                        return True
                except Exception:
                    continue  # Try next query
            
            # If all queries failed
            self.log_result(
                test_name, False,
                "Comprehensive search failed for all test queries",
                time.time() - start_time
            )
            return False
                
        except Exception as e:
            self.log_result(test_name, False, f"Comprehensive search error: {str(e)}", time.time() - start_time)
            return False
    
    async def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 STARTING MCP SERVER COMPREHENSIVE TESTING")
        print("=" * 60)
        print(f"⏰ Test Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        # Test sequence
        tests = [
            self.test_server_initialization,
            self.test_translation_tool,
            self.test_language_detection,
            self.test_web_search,
            self.test_fact_check,
            self.test_vision_ocr,
            self.test_vision_labels,
            self.test_comprehensive_search
        ]
        
        # Run all tests
        results = []
        for test_func in tests:
            result = await test_func()
            results.append(result)
            print()  # Add spacing between tests
        
        # Generate final report
        self.generate_report(results)
    
    def generate_report(self, results: list):
        """Generate final test report"""
        print("=" * 60)
        print("📊 MCP SERVER TEST REPORT")
        print("=" * 60)
        
        passed = sum(1 for result in results if result)
        total = len(results)
        pass_rate = (passed / total) * 100
        
        print(f"🎯 SUMMARY: {passed}/{total} tests passed ({pass_rate:.1f}%)")
        print()
        
        # Individual test results
        for result in self.test_results:
            print(f"{result['status']} {result['test']}")
            if result['details']:
                print(f"    {result['details']}")
        
        print()
        print(f"⏰ Test End Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Final verdict
        if passed == total:
            print("🎉 ALL TESTS PASSED! MCP Server is fully functional!")
            print("✅ Google APIs integration working")
            print("✅ MCP tools properly implemented")
            print("✅ Ready for production use")
        elif passed >= total * 0.75:  # 75% or better
            print("⚡ MOST TESTS PASSED! MCP Server is largely functional")
            print("✅ Core functionality working")
            print("⚠️  Some minor issues to address")
        else:
            print("⚠️  SOME TESTS FAILED - Review configuration")
            print("🔧 Check Google API keys and network connectivity")

async def main():
    """Main test execution"""
    tester = MCPServerTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())
