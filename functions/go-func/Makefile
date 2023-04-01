all: build

test-go:
	go test ./...
	go vet ./...

build-go:	test-go
	go build ./...
	cd cmd/forester-func-dev && go build

build-js:
	cd javascript/functions && npm install && npm run build

build: build-go build-js

clean:
	go clean ./...

.PHONY: test-go build-go build-js build clean
