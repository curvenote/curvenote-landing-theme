.PHONY: build-theme build-landing deploy deploy-theme check

COMMIT = $(shell git rev-parse --short HEAD)
# You may need to install jq for this to work!
VERSION = $(shell cat packages/site/package.json | jq -r '.version')

THEME=landing

check:
	@which jq > /dev/null || (echo "Error: the jq linux command is not available. Please install it first (brew install jq | apt-get install jq)." && exit 1)

build-theme:
	mkdir .deploy || true
	rm -rf .deploy/$(THEME)
	git clone --depth 1 https://github.com/curvenote-themes/$(THEME) .deploy/$(THEME)
	rm -rf .deploy/$(THEME)/public .deploy/$(THEME)/build .deploy/$(THEME)/package.json .deploy/$(THEME)/package-lock.json .deploy/$(THEME)/template.yml .deploy/$(THEME)/server.js
	find template -type f  -exec cp {} .deploy/$(THEME) \;
	npm run prod:build
	cp -r public .deploy/$(THEME)/public
	cp -r build .deploy/$(THEME)/build
	cp -r template.yml .deploy/$(THEME)/template.yml
	sed -i.bak "s/template/$(THEME)/g" .deploy/$(THEME)/package.json
	sed -i.bak "s/VERSION/$(VERSION)/g" .deploy/$(THEME)/package.json
	rm .deploy/$(THEME)/package.json.bak
	cd .deploy/$(THEME) && npm install

build-landing:
	make THEME=landing build-theme

deploy-theme: check
	echo "Deploying $(THEME) theme to curvenote-themes/$(THEME)"
	echo "Version: $(VERSION)"
	make THEME=$(THEME) build-theme
	cd .deploy/$(THEME) && git add .
	cd .deploy/$(THEME) && git commit -m "🚀 v$(VERSION) from $(COMMIT)"
	cd .deploy/$(THEME) && git push -u origin main


deploy:
deploy-landing:
	make THEME=landing deploy-theme
