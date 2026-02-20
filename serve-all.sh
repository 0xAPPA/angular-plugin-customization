#!/bin/bash

# Serve all demo apps concurrently
# Ports: 4201-4205

echo "Starting all demo apps..."
echo "Approach 1 - DI Plugin: http://localhost:4201"
echo "Approach 2 - Module Federation: http://localhost:4202"
echo "Approach 3 - Web Components: http://localhost:4203"
echo "Approach 4 - Config Driven: http://localhost:4204"
echo "Approach 5 - Dynamic Components: http://localhost:4205"
echo ""

cd demos/approach-1-di-plugin && npm start &
cd demos/approach-2-module-federation && npm start &
cd demos/approach-3-web-components && npm start &
cd demos/approach-4-config-driven && npm start &
cd demos/approach-5-dynamic-components && npm start &

wait
