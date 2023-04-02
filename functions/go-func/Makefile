all: build

test:
	go test ./...
	go vet ./...

build:	test
	go build ./...
	cd cmd/forester-func-dev && go build

clean:
	go clean ./...

.PHONY: test build clean
