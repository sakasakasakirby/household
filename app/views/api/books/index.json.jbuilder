json.array! @books do |book|
  json.name book.name
  json.money book.money
  json.date book.date
  json.item_id book.item_id
  json.total @money[book.item_id-1]
  json.total_array @money
  json.double_array @total
  json.target @target
end
