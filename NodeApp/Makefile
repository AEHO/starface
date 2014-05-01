all: node_modules
	@echo "Building App.nw"
	@zip -r app.nw ./*

node_modules:
	if [ ! -d node_modules ]; then npm install; fi;

clean:
	@echo "Removing app.nw"
	@rm -rf app.nw

clean_all: clean
	rm -rf node_modules
