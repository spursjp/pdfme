cd packages

for dir in $(ls -d */); do
    cd "$dir"
    npm link
    cd ..
done

for dir in generator ui; do
    cd "$dir"
    npm link @spursjp/pdfme-common
    cd ..
done
